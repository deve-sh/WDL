export type RequestArgs = {
	endpoint: string;
	method?: string;
	headers?: HeadersInit | string;
	body?: Record<string, any> | string;
};

export type RequestAction = RequestArgs & {
	type: "request";
	onSuccess: { targetStep: string };
	onError: { targetStep: string };
};

export type ResolverAction = {
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

export type RequestOrResolverWorkflowStep = {
	type: "request-or-resolver";
	action: RequestAction | ResolverAction;
};
