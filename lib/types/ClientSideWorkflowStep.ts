export type ClientSideWorkflowStepInputs = {
	type: "tel" | "text" | "number" | "file";
	required?: boolean;
	attributes: {
		label: string;
		placeholder?: string;
		defaultValue?: string;
	};
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
	type: "interactive-step";
	inputs: ClientSideWorkflowStepInputs[];
	actions: ClientSideWorkflowStepActions[];
};
