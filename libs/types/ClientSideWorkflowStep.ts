export type ClientSideWorkflowStepInputs = {
	type: "tel" | "text" | "number" | "file";
	required?: boolean;
	text: string;
	id: string;
};

export type ClientSideWorkflowStepActions = {
	id: string;
	type: "button";
	attributes: {
		primary: boolean;
		type?: "submit";
		label: string;
	};
	onSuccess: { targetStep: string };
	onError?: { targetStep: string };
	validations: { condition: string; errorMessage: string }[];
};

export type ClientSideWorkflowStep = {
	participant: "customer";
	inputs: ClientSideWorkflowStepInputs[];
	actions: ClientSideWorkflowStepActions[];
};
