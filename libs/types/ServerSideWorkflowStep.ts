export type ServerSideRequest = {
	endpoint: string;
	method: string;
	headers?: Record<string, string | number>;
	body?: Record<string, any>;
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
                stepId: "...",
                resolver: () => {
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
