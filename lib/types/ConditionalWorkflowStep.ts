export type ConditionalWorkflowStep = {
	type: "condition";
	condition: string;
	onTrue: { targetStep: string };
	onFalse: { targetStep: string };
};
