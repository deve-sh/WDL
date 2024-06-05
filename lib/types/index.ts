import type { InteractiveWorkflowStep } from "./InteractiveWorkflowStep";
import type { RequestOrResolverWorkflowStep } from "./RequestOrResolverWorkflowStep";

import type { WorkflowStepResolver } from "./Resolver";
import type { WorkflowCurrentState } from "./WorkflowCurrentState";
import type { RedirectionWorkflowStep } from "./RedirectWorkflowStep";
import type { ConditionalWorkflowStep } from "./ConditionalWorkflowStep";

export type WorkflowStep = {
	id: string;
	name: string;
	heading?: string;
	description?: string;
	additionalData?: Record<string, any>;
} & (
	| InteractiveWorkflowStep
	| RequestOrResolverWorkflowStep
	| RedirectionWorkflowStep
	| ConditionalWorkflowStep
);

export type WorkflowDefinitionSchema = {
	id: string;
	steps: WorkflowStep[];
};

export type WorkflowInitOptions = {
	environmentContext: {
		[key: string]: any;
	};
	resolvers: {
		[stepId: string]: WorkflowStepResolver;
	};
};

export { WorkflowCurrentState, WorkflowStepResolver };
