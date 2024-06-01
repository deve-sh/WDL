import type Workflow from "../api/Workflow";
import type { WorkflowInitOptions } from ".";

export type WorkflowStepResolver = (
	workflow: Workflow,
	env: WorkflowInitOptions["environmentContext"]
) => any | Promise<any>;
