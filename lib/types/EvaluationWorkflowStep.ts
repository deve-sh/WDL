export type EvaluationWorkflowStep = {
	type: "evaluation";
	expression: string;
	onComplete: { targetStep: string };
};
