export type InteractiveWorkflowStepInputs = {
	type: "input";
	required?: boolean;
	attributes: {
		type: string;
		label: string;
		placeholder?: string;
		defaultValue?: string;
		options?: any[];
	} & Record<string, any>; // Any other attributes
	id: string;
};

export type InteractiveWorkflowStepBlock = {
	type: "text" | "heading" | "image" | "line-break" | "misc";
	data: any;
};

export type InteractiveWorkflowStepActions = {
	id: string;
	type?: string;
	attributes?: {
		primary?: boolean;
		type?: string;
		label: string;
	} & Record<string, any>; // Any other attributes
	validations?: { condition: string; errorMessage: string }[];
	onValidationSuccess: { targetStep: string };
	onValidationError?: { targetStep: string };
};

export type InteractiveWorkflowStep = {
	type: "interactive-step";
	blocks: (InteractiveWorkflowStepInputs | InteractiveWorkflowStepBlock)[];
	actions: InteractiveWorkflowStepActions[];
};
