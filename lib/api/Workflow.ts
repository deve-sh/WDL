import type {
	WorkflowCurrentState,
	WorkflowDefinitionSchema,
	WorkflowInitOptions,
	WorkflowStep,
	WorkflowStepResolver,
} from "../types";
import type { InteractiveWorkflowStep } from "../types/InteractiveWorkflowStep";

import parseAndResolveTemplateString from "./helpers/parseAndResolveTemplateString";
import processConditional from "./helpers/processConditional";
import processEvaluation from "./helpers/processEvaluation";
import request from "./helpers/request";

class Workflow {
	template: WorkflowDefinitionSchema;
	loadedCurrentState: boolean = false;
	currentState: WorkflowCurrentState = {
		currentStep: "",
		metadata: { general: {} },
	};
	options: WorkflowInitOptions;

	constructor(
		workflowTemplate: WorkflowDefinitionSchema,
		options?: Partial<WorkflowInitOptions>
	) {
		if (!workflowTemplate)
			throw new Error("Workflow: Invalid Workflow initialization");

		if (
			!workflowTemplate.id ||
			!workflowTemplate.steps ||
			!workflowTemplate.steps.length
		)
			throw new Error(
				"Workflow: Invalid Workflow initialization: Steps or ID of the Workflow not defined"
			);

		this.template = workflowTemplate;
		this.options = {
			resolvers: options ? options.resolvers || {} : {},
			environmentContext: options ? options.environmentContext || {} : {},
		};
	}

	loadCurrentState(currentState?: WorkflowCurrentState) {
		this.loadedCurrentState = true;

		this.currentState = currentState || {
			currentStep: this.template.steps[0].id,
			metadata: { general: {} },
		};

		return this;
	}

	throwIfCurrentStateNotLoaded() {
		if (!this.currentState || !this.loadedCurrentState)
			throw new Error(
				"Workflow: Current State of Workflow not loaded via workflow.loadCurrentState"
			);
	}

	getCurrentStep() {
		this.throwIfCurrentStateNotLoaded();

		return this.template.steps.find(
			(step) => step.id === this.currentState?.currentStep
		);
	}

	/**
	 * For exporting a copy of current state for storage in a database or persistent storage
	 */
	getCurrentState() {
		this.throwIfCurrentStateNotLoaded();

		return this.currentState;
	}

	getStepMetadata(stepId: string) {
		this.throwIfCurrentStateNotLoaded();

		return this.currentState?.metadata[stepId] || null;
	}

	setStepMetadata(
		stepId: string,
		metadata: WorkflowCurrentState["metadata"][string]
	) {
		this.throwIfCurrentStateNotLoaded();

		if (!this.currentState) return;

		this.currentState.metadata[stepId] = {
			...this.currentState.metadata[stepId],
			...metadata,
		};
	}

	goToStep(
		stepId: string,
		prevStepMetadata?: WorkflowCurrentState["metadata"][string]
	) {
		this.throwIfCurrentStateNotLoaded();

		if (prevStepMetadata) {
			const currentStep = this.getCurrentState()?.currentStep as string;
			this.setStepMetadata(currentStep, prevStepMetadata);
		}

		const currentState = this.getCurrentState() as WorkflowCurrentState;
		this.loadCurrentState({ ...currentState, currentStep: stepId });

		return true;
	}

	goAhead(metadata?: WorkflowCurrentState["metadata"][string]) {
		this.throwIfCurrentStateNotLoaded();

		const currentState = this.currentState;

		if (!currentState) return false;

		const currentStepIndex = this.template.steps.findIndex(
			(step) => step.id === currentState.currentStep
		);
		if (
			currentStepIndex < 0 ||
			this.template.steps.length <= currentStepIndex + 1
		)
			return false;

		const nextStepId = this.template.steps[currentStepIndex + 1].id;

		return this.goToStep(nextStepId, metadata);
	}

	goBack(metadata?: WorkflowCurrentState["metadata"][string]) {
		this.throwIfCurrentStateNotLoaded();

		const currentState = this.currentState;

		if (!currentState) return false;

		const currentStepIndex = this.template.steps.findIndex(
			(step) => step.id === currentState.currentStep
		);
		if (
			currentStepIndex < 0 ||
			this.template.steps.length <= currentStepIndex - 1
		)
			return false;

		const nextStepId = this.template.steps[currentStepIndex - 1].id;

		return this.goToStep(nextStepId, metadata);
	}

	getRegisteredResolverForStep(stepId: string) {
		if (this.options.resolvers && this.options.resolvers[stepId])
			return this.options.resolvers[stepId];
		return null;
	}

	registerResolver(stepId: string, resolver: WorkflowStepResolver) {
		if (!this.options.resolvers) this.options.resolvers = {};
		return (this.options.resolvers[stepId] = resolver);
	}

	/**
	 * Client side workflow step validator on proceeding with any action
	 */
	async validateStepAction(
		stepId: string,
		actionId: string, // The id of the action that's been clicked
		inputs: Record<string, any> // The inputs corresponding to the step that have been provided.
	) {
		this.throwIfCurrentStateNotLoaded();

		const step = this.template.steps.find(
			(step) => step.id === stepId
		) as InteractiveWorkflowStep;
		if (!step) throw new Error("Workflow: Step not found");
		if (step.type !== "interactive-step")
			throw new Error(
				"Workflow: Only Interactive Step Types can be validated. For all other steps, use a resolver"
			);
		if (!step.actions) throw new Error("Workflow: Step does not have actions");

		const action = step.actions.find((action) => action.id === actionId);
		if (!action) throw new Error("Workflow: Step action not found");

		const validations = action.validations || [];

		let passedAllValidations = true;
		let validationErrors: string[] = [];

		for (let validation of validations) {
			const outputOfEvaluation = processConditional(validation.condition, {
				...this.generateVariablesForInterpolation(),
				steps: {
					...this.generateVariablesForInterpolation(),
					[(step as WorkflowStep).id]: { inputs },
				},
			});
			if (!outputOfEvaluation) {
				passedAllValidations = false;
				validationErrors.push(validation.errorMessage);
			}
		}

		const existingMetadata = this.getStepMetadata(stepId);
		let newMetadata: typeof existingMetadata = { ...existingMetadata, inputs };

		if (validationErrors.length) {
			newMetadata = {
				...newMetadata,
				validationErrors: {
					...existingMetadata?.validationErrors,
					[actionId]: validationErrors,
				},
			};
		}

		this.setStepMetadata(stepId, newMetadata);

		// Process onValidationSuccess of this step
		if (
			passedAllValidations &&
			action.onValidationSuccess &&
			action.onValidationSuccess.targetStep
		)
			this.goToStep(action.onValidationSuccess.targetStep, { inputs });

		if (
			!passedAllValidations &&
			action.onValidationError &&
			action.onValidationError.targetStep
		)
			this.goToStep(action.onValidationError.targetStep, { inputs });

		return { isValid: passedAllValidations, validationErrors };
	}

	/**
	 * Only for backend and webhook based steps.
	 * Use validateStep to process client side interaction based events.
	 */
	async processCurrentStep() {
		this.throwIfCurrentStateNotLoaded();

		const step = this.template.steps.find(
			(step) => step.id === this.currentState?.currentStep
		);

		if (!step) throw new Error("Workflow: Step not found");

		// Resolvers for a step take precedence over everything
		// and do not care about the native behaviour of steps
		const resolverFunc = this.getRegisteredResolverForStep(step.id);
		if (resolverFunc)
			return resolverFunc(this, this.options.environmentContext || {});

		// Handling steps with pre-defined behaviour
		if (
			step.type === "condition" &&
			step.condition &&
			step.onTrue &&
			step.onFalse
		) {
			const result = processConditional(
				step.condition,
				this.generateVariablesForInterpolation()
			);

			if (result) return this.goToStep(step.onTrue.targetStep, { result });
			return this.goToStep(step.onFalse.targetStep, { result });
		}

		if (step.type === "evaluation" && step.expression && step.onComplete) {
			const result = processEvaluation(
				step.expression,
				this.generateVariablesForInterpolation()
			);

			return this.goToStep(step.onComplete.targetStep, { result });
		}

		if (
			step.type === "request-or-resolver" &&
			step.action &&
			step.action.type === "request"
		) {
			const { failed, errorMessage, response } = await request(
				step.action,
				this.generateVariablesForInterpolation()
			);

			const targetStep = failed
				? step.action.onError && step.action.onError.targetStep
				: step.action.onSuccess && step.action.onSuccess.targetStep;

			if (targetStep) {
				return this.goToStep(targetStep, {
					errorMessage,
					failed,
					response,
				});
			}

			return;
		}

		if (step.type === "redirect") {
			if (typeof window !== "undefined") {
				// If this is being run on the client side, redirect the window
				// For server-side actions just use a resolver.
				return (window.location.href = parseAndResolveTemplateString(
					step.url,
					this.generateVariablesForInterpolation()
				));
			}
		}

		throw new Error(
			"Workflow: Step " + step.id + " does not have a valid action or resolver"
		);
	}

	// #Utils
	private generateVariablesForInterpolation() {
		const currentState = this.getCurrentState() as WorkflowCurrentState;

		return {
			steps: currentState.metadata,
			env: this.options.environmentContext,
		};
	}
}

export default Workflow;
