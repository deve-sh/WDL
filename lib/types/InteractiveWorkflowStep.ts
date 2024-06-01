export type InteractiveWorkflowStepInputs = {
	required?: boolean;
	attributes: {
		type: string;
		label: string;
		placeholder?: string;
		defaultValue?: string;
	};
	id: string;
};

export type InteractiveWorkflowStepActions = {
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

export type InteractiveWorkflowStep = {
	type: "interactive-step";
	inputs: InteractiveWorkflowStepInputs[];
	actions: InteractiveWorkflowStepActions[];
};
