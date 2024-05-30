import {
	WorkflowCurrentState,
	WorkflowDefinitionSchema,
	WorkflowInitOptions,
} from ".";

export type WorkflowStepResolver = (
	template: WorkflowDefinitionSchema,
	currentState: WorkflowCurrentState,
	env: WorkflowInitOptions["environmentContext"]
) => Promise<any>;
