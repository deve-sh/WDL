import type Workflow from "libs/api/Workflow";
import type { WorkflowInitOptions } from ".";

export type WorkflowStepResolver = (
	workflow: Workflow,
	env: WorkflowInitOptions["environmentContext"]
) => Promise<any>;
