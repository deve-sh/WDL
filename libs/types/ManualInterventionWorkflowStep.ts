export type ManualInterventionWorkflowStepInputs = {
	type: "tel" | "text" | "number";
	required?: boolean;
	text: string;
	id: string;
};

export type ManualInterventionWorkflowStepActions = {
	type: "button";
	attributes: {
		primary: boolean;
		type?: "submit";
		label: string;
		onSuccess: { targetStep: string };
	};
	validations: { condition: string; errorMessage: string }[];
};

export type ManualInterventionWorkflowStep = {
	participant: "manual-intervention";
	inputs: ManualInterventionWorkflowStepInputs[];
	actions: ManualInterventionWorkflowStepActions[];
};
