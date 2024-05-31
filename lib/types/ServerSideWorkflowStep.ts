export type RequestArgs = {
	endpoint: string;
	method?: string;
	headers?: HeadersInit;
	body?: Record<string, any>;
};

export type ServerSideRequest = RequestArgs & {
	type: "request";
	onSuccess: { targetStep: string };
	onError: { targetStep: string };
};

export type ServerSideResolver = {
	type: "resolver";
	/*
        If there are no requests defined
        Then this step has to be manually plugged into
        and a resolver has to be specified by the consumer.

        new Workflow(workflowDefinition, {
            resolvers: {
                [stepId]: () => {
                    // Do something with workflow definition and workflow's current state
                },
            },
        });

        (or)

        workflowBuilder.registerResolver(stepId, () => { ... })

        The resolver is passed a the workflow class where it is responsible for movine the state of the workflow.
    */
};

export type ServerSideWorkflowStep = {
	type: "request-or-resolver";
	action: ServerSideRequest | null;
};
