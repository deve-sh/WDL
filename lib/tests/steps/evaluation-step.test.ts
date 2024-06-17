import { describe, expect, it } from "@jest/globals";
import Workflow from "../../api";
import workflowTemplate from "../mocks/sampleWorkflow";
import { EvaluationWorkflowStep } from "../../types/EvaluationWorkflowStep";

describe("Evaluation Workflow Step tests", () => {
	it("should resolve expression and redirect workflow to the indicated step via onComplete parameter", async () => {
		const evaluationStep = workflowTemplate.steps.find(
			(step) => step.id === "evaluationStep"
		) as EvaluationWorkflowStep;

		let workflow = new Workflow(workflowTemplate).loadCurrentState({
			currentStep: "evaluationStep",
			metadata: {
				general: {},
				sendingOTPStage: { inputs: { phoneNumber: "1234567890" } },
			},
			executionSequence: []
		});

		await workflow.processCurrentStep();

		expect(workflow.getCurrentState().currentStep).toBe(
			evaluationStep.onComplete.targetStep
		);

		expect(workflow.getCurrentState().metadata.evaluationStep).toMatchObject({
			result: "+911234567890",
		});
	});
});
