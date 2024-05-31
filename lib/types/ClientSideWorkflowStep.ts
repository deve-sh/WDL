export type ClientSideWorkflowStepInputs = {
	required?: boolean;
	attributes: {
		type: string;
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
		primary?: boolean;
		type?: string;
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
