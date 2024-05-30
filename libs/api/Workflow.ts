import type {
	WorkflowCurrentState,
	WorkflowDefinitionSchema,
	WorkflowInitOptions,
} from "../types";
import type { ClientSideWorkflowStep } from "../types/ClientSideWorkflowStep";
import parseAndResolveTemplateString from "./parsers/parseAndResolveTemplateString";

class Workflow {
	template: WorkflowDefinitionSchema;
	currentState?: WorkflowCurrentState;
	options: WorkflowInitOptions;

	constructor(
		workflowTemplate: WorkflowDefinitionSchema,
		options: WorkflowInitOptions
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
		this.options = { resolvers: {}, environmentContext: {}, ...options };
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

		const currentState = this.currentState;

		if (!currentState) return;

		const step = this.template.steps.find(
			(step) => step.id === stepId
		) as ClientSideWorkflowStep;

		if (!step) throw new Error("Step not found");

		if (!step.actions) throw new Error("Step does not have actions");

		const action = step.actions.find((action) => action.id === actionId);

		if (!action) throw new Error("Step action not found");

		const validations = action.validations || [];

		let passedAllValidations = true;

		for (let validation of validations) {
			// Create an if-else condition

			// TODO: Probably sanitize JS code? This is equivalent of an "eval" statement
			const conditionExpressionToEvaluate = `
				const env = ${JSON.stringify(this.options.environmentContext)};
				const steps = ${JSON.stringify({
					...currentState.metadata,
					[stepId]: { inputs },
				})};
				return (${validation.condition});
			`;

			const evaluationFunction = new Function(conditionExpressionToEvaluate);
			const outputOfEvaluation = evaluationFunction();

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

		const step = this.template.steps.find(
			(step) => step.id === this.currentState?.currentStep
		);

		if (!step) return;
	}
}

export default Workflow;
