export type WebhookWorkflowStep = {
	participant: "webhook";
    /*
        A resolver is needed to handle data coming in from the webhook:

        new Workflow(workflowDefinition, {
            resolvers: {
                stepId: "...",
                resolver: () => {
                    // Do something with workflow definition and workflow current state
                },
            },
        });

        (or)

        workflowBuilder.defineResolver(stepId, () => { ... })
     */
};
