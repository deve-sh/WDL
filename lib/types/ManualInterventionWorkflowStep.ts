export type ManualInterventionWorkflowStepInputs = {
	type: "tel" | "text" | "number" | "file";
	required?: boolean;
	attributes: {
		label: string;
		placeholder?: string;
		defaultValue?: string;
	};
	id: string;
};

export type ManualInterventionWorkflowStepActions = {
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

export type ManualInterventionWorkflowStep = {
	participant: "manual-intervention";
	inputs: ManualInterventionWorkflowStepInputs[];
	actions: ManualInterventionWorkflowStepActions[];
};
