import type { ClientSideWorkflowStep } from "./ClientSideWorkflowStep";
import type { ServerSideWorkflowStep } from "./ServerSideWorkflowStep";

import type { WorkflowStepResolver } from "./Resolver";
import type { WorkflowCurrentState } from "./WorkflowCurrentState";
import { RedirectionWorkflowStep } from "./RedirectWorkflowStep";

export type WorkflowStepParticipants =
	| "interactive-client"
	| "client-redirector"
	| "server";

export type WorkflowStep = {
	id: string;
	name: string;
	heading?: string;
	description?: string;
	additionalData?: Record<string, any>;
} & (ClientSideWorkflowStep | ServerSideWorkflowStep | RedirectionWorkflowStep);

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
