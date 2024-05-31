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
	type?: string;
	attributes?: {
		primary: boolean;
		type?: "submit";
		label: string;
	};
	validations?: { condition: string; errorMessage: string }[];
	onValidationSuccess: { targetStep: string };
	onValidationError?: { targetStep: string };
};

export type ClientSideWorkflowStep = {
	type: "interactive-step";
	inputs: ClientSideWorkflowStepInputs[];
	actions: ClientSideWorkflowStepActions[];
};
