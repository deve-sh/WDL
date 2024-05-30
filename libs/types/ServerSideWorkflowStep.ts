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
        and a resolver has to be specified by the server.

        new Workflow(workflowDefinition, {
            resolvers: {
                [stepId]: () => {
                    // Do something with workflow definition and workflow's current state
                },
            },
        });

        (or)

        workflowBuilder.defineResolver(stepId, () => { ... })
    */
};

export type ServerSideWorkflowStep = {
	participant: "server";
	action: ServerSideRequest | ServerSideResolver;
};
