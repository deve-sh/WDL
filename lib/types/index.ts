import type { ClientSideWorkflowStep } from "./ClientSideWorkflowStep";
import type { ServerSideWorkflowStep } from "./ServerSideWorkflowStep";
import type { WebhookWorkflowStep } from "./WebhookWorkflowStep";

import type { WorkflowStepResolver } from "./Resolver";
import type { WorkflowCurrentState } from "./WorkflowCurrentState";
import { RedirectionWorkflowStep } from "./RedirectWorkflowStep";

export type WorkflowStepParticipants =
	| "interactive-client"
	| "client-redirector"
	| "server"
	| "webhook-handler";

export type WorkflowStep = {
	id: string;
	heading: string;
	description?: string;
	additionalData?: Record<string, any>;
} & (
	| ClientSideWorkflowStep
	| ServerSideWorkflowStep
	| WebhookWorkflowStep
	| RedirectionWorkflowStep
);

export type WorkflowDefinitionSchema = {
	id: string;
	steps: WorkflowStep[];
};

export type WorkflowInitOptions = {
	idealParticipant: WorkflowStepParticipants;
	environmentContext: {
		[key: string]: string;
	};
	resolvers: {
		[stepId: string]: WorkflowStepResolver;
	};
};

export { WorkflowCurrentState, WorkflowStepResolver };
