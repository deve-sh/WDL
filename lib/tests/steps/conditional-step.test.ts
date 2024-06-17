import { describe, expect, it } from "@jest/globals";
import Workflow from "../../api";
import workflowTemplate from "../mocks/sampleWorkflow";
import { ConditionalWorkflowStep } from "../../types/ConditionalWorkflowStep";

describe("Conditional Workflow Step tests", () => {
	it("should resolve conditional step and redirect workflow to the indicated step via onTrue and onFalse", async () => {
		const conditionalStep = workflowTemplate.steps.find(
			(step) => step.id === "conditionalAssessmentStep"
		) as ConditionalWorkflowStep;

		let workflow = new Workflow(workflowTemplate).loadCurrentState({
			currentStep: "conditionalAssessmentStep",
			metadata: {
				general: {},
				sendingOTPStage: { inputs: { phoneNumber: "1234567890" } },
			},
			executionSequence: [],
		});

		await workflow.processCurrentStep();

		// onTrue
		expect(workflow.getCurrentState().currentStep).toBe(
			conditionalStep.onTrue.targetStep
		);

		// Testing for onFalse logic
		workflow = new Workflow(workflowTemplate).loadCurrentState({
			currentStep: "conditionalAssessmentStep",
			metadata: {
				general: {},
				sendingOTPStage: { inputs: { phoneNumber: "1234567891" } },
			},
			executionSequence: [],
		});

		await workflow.processCurrentStep();

		expect(workflow.getCurrentState().currentStep).toBe(
			conditionalStep.onFalse.targetStep
		);

		// Metadata stored in the step for usage in other steps
		expect(
			workflow.getCurrentState().metadata.conditionalAssessmentStep.result
		).toBe(false);
	});
});
