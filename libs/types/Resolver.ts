import { WorkflowCurrentState, WorkflowDefinitionSchema } from ".";

export type WorkflowStepResolver = (
	template: WorkflowDefinitionSchema,
	currentState: WorkflowCurrentState
) => Promise<any>;
