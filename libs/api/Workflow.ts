import type {
	WorkflowCurrentState,
	WorkflowDefinitionSchema,
	WorkflowInitOptions,
} from "../types";
import type { ClientSideWorkflowStep } from "../types/ClientSideWorkflowStep";

import processConditional from "./helpers/processConditional";
import request from "./helpers/request";

class Workflow {
	template: WorkflowDefinitionSchema;
	currentState?: WorkflowCurrentState;
	options: WorkflowInitOptions;

	constructor(
		workflowTemplate: WorkflowDefinitionSchema,
		options: Partial<WorkflowInitOptions>
	) {
		if (!workflowTemplate) throw new Error("Invalid Workflow initialization");

		if (
			!workflowTemplate.id ||
			!workflowTemplate.steps ||
			!workflowTemplate.steps.length
		)
			throw new Error(
				"Invalid Workflow initialization: Steps or ID of the Workflow not defined"
			);

		if (!options || !options.participant)
			throw new Error("Invalid Workflow initialization: Options not provided");

		this.template = workflowTemplate;
		this.options = {
			participant: options.participant,
			resolvers: options.resolvers || {},
			environmentContext: options.environmentContext || {},
		};
	}

	loadCurrentState(currentState?: WorkflowCurrentState) {
		this.currentState = currentState || {
			currentStep: this.template.steps[0].id,
			metadata: { general: {} },
		};
	}

	throwIfCurrentStateNotLoaded() {
		if (!this.currentState)
			throw new Error(
				"Current State of Workflow not loaded via workflow.loadCurrentState"
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

		if (this.currentState) this.currentState.metadata[stepId] = metadata;
	}

	goToStep(
		stepId: string,
		metadata?: WorkflowCurrentState["metadata"][string]
	) {
		this.throwIfCurrentStateNotLoaded();

		const currentState = this.currentState;

		if (!currentState) return false;

		const updatedCurrentState = {
			...currentState,
			currentStep: stepId,
		};

		if (metadata) {
			updatedCurrentState.metadata[stepId] = {
				...updatedCurrentState.metadata[stepId],
				...metadata,
			};
		}

		this.loadCurrentState(updatedCurrentState);
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

		this.goToStep(nextStepId, metadata);
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

		this.goToStep(nextStepId, metadata);
	}

	/**
	 * Client side workflow step validator on proceeding with any action
	 */
	async validateStepAction(
		stepId: string,
		actionId: string, // The id of the button/action that's been clicked
		inputs: Record<string, any> // The inputs corresponding to the step that have been provided.
	) {
		this.throwIfCurrentStateNotLoaded();

		const step = this.template.steps.find(
			(step) => step.id === stepId
		) as ClientSideWorkflowStep;
		if (!step) throw new Error("Step not found");
		if (!step.actions) throw new Error("Step does not have actions");

		const action = step.actions.find((action) => action.id === actionId);
		if (!action) throw new Error("Step action not found");

		const validations = action.validations || [];

		const currentStateMetadata = {
			...(this.getCurrentState() as WorkflowCurrentState).metadata,
			[stepId]: { inputs },
		};

		let passedAllValidations = true;
		for (let validation of validations) {
			const outputOfEvaluation = processConditional(
				validation.condition,
				currentStateMetadata,
				this.options.environmentContext
			);
			if (!outputOfEvaluation) passedAllValidations = false;
		}

		return passedAllValidations;
	}

	/**
	 * Only for backend and webhook based steps.
	 * Use validateStep to process client side interaction based events.
	 */
	async processCurrentStep() {
		this.throwIfCurrentStateNotLoaded();

		const currentState = this.getCurrentState() as WorkflowCurrentState;

		const step = this.template.steps.find(
			(step) => step.id === this.currentState?.currentStep
		);

		if (!step) throw new Error("Step not found");

		if (step.participant === "server") {
			if (step.action.type === "request") {
				const { failed, errorMessage, response } = await request(
					step.action,
					currentState.metadata,
					this.options.environmentContext
				);

				const targetStep = failed
					? step.action.onError && step.action.onError.targetStep
					: step.action.onSuccess && step.action.onSuccess.targetStep;

				if (targetStep) {
					this.goToStep(targetStep, {
						errorMessage,
						failed,
						response,
					});
				}
			}

			if (step.action.type === "resolver") {
				if (!this.options.resolvers[step.id])
					throw new Error(
						"Workflow: Resolver for server-side step" +
							step.id +
							"is not defined"
					);

				return this.options.resolvers[step.id](
					this.template,
					currentState,
					this.options.environmentContext
				);
			}
		}

		if (step.participant === "webhook") {
			// Webhooks always need a resolver
			if (!this.options.resolvers[step.id])
				throw new Error(
					"Workflow: Resolver for webhook step" + step.id + "is not defined"
				);

			return this.options.resolvers[step.id](
				this.template,
				currentState,
				this.options.environmentContext
			);
		}

		throw new Error(
			"Workflow: Step does not have a valid action, resolver or particpant"
		);
	}
}

export default Workflow;
