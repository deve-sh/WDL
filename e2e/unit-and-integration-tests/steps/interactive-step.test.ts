import { describe, expect, it } from "@jest/globals";

import workflowTemplate from "../mocks/sampleWorkflow";

import Workflow from "../../../lib/api/Workflow";

import type { InteractiveWorkflowStep } from "../../../lib/types/InteractiveWorkflowStep";

describe("Tests for Interactive Input Steps", () => {
	it("should throw error on invalid action passed", async () => {
		const workflow = new Workflow(workflowTemplate).loadCurrentState();

		try {
			await workflow.validateStepAction(
				"enterPhoneNumberStep",
				"invalidActionButton",
				{}
			);
		} catch (error) {
			expect(error.message).toMatch("Workflow: Step action not found");
		}
	});

	it("should return error values on validation failure", async () => {
		const workflow = new Workflow(workflowTemplate).loadCurrentState();

		const validationResult = await workflow.validateStepAction(
			"enterPhoneNumberStep",
			"submitButton",
			{ phoneNumber: "" }
		);

		expect(validationResult.isValid).toBe(false);
		expect(validationResult.validationErrors).toHaveLength(1);
		expect(typeof validationResult.validationErrors[0]).toBe("string");
	});

	it("should return true on validation success", async () => {
		const workflow = new Workflow(workflowTemplate).loadCurrentState();

		const validationResult = await workflow.validateStepAction(
			"enterPhoneNumberStep",
			"submitButton",
			{ phoneNumber: "911234567890" }
		);

		expect(validationResult.isValid).toBe(true);
		expect(validationResult.validationErrors).toHaveLength(0);
		expect(validationResult.validationErrors[0]).not.toBeDefined();
	});

	it("should consider onValidationSuccess and onValidationError for actions & make changes to the current state of the workflow for the consumer to use", async () => {
		const workflow = new Workflow(workflowTemplate).loadCurrentState();

		const inputs = { phoneNumber: "911234567890" };

		await workflow.validateStepAction(
			"enterPhoneNumberStep",
			"submitButton",
			inputs
		);

		const newState = workflow.getCurrentState();

		const stepToGoToOnSuccess = (
			workflowTemplate.steps[0] as InteractiveWorkflowStep
		).actions[0].onValidationSuccess.targetStep;

		const newStateStepMetadataForOtherStepsToUse =
			newState?.metadata[workflowTemplate.steps[0].id];

		expect(newState?.currentStep).toBe(stepToGoToOnSuccess);
		expect(newStateStepMetadataForOtherStepsToUse).toMatchObject({ inputs });
	});
});
