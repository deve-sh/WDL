const workflowTemplate = {
	version: 1,
};

const initWorkflow = async () => {
	const Workflow = (await import("lib/api/Workflow")).default;

	// @ts-expect-error Dummy
	const workflow = new Workflow(workflowTemplate, {
		idealParticipant: "server",
		environmentContext: { api_key: "abcdef" },
	});

	// @ts-expect-error Dummy
	window.workflow = workflow;

	workflow.loadCurrentState();

	console.log(workflow);
};

export default initWorkflow;
