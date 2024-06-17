import { describe, expect, test } from "@jest/globals";

import Workflow from "../../lib/api";
import workflowTemplate from "./mocks/sampleWorkflow";

import type { WorkflowCurrentState } from "../../lib/types";

describe("Core APIs Tests for Workflow Library", () => {
	test("goAhead, goBack and goToStep functions should work as expected", async () => {
		const workflow = new Workflow(workflowTemplate).loadCurrentState();

		let currentState: WorkflowCurrentState;

		// Go Ahead
		const metadataToAttachToStep = { dummyData: 1 };
		workflow.goAhead(metadataToAttachToStep);

		currentState = workflow.getCurrentState();

		expect(
			workflow.getStepMetadata(workflowTemplate.steps[0].id)
		).toMatchObject(metadataToAttachToStep);
		expect(currentState.currentStep).toBe(workflowTemplate.steps[1].id);

		// Go Back
		workflow.goBack(metadataToAttachToStep);
		currentState = workflow.getCurrentState();

		expect(
			workflow.getStepMetadata(workflowTemplate.steps[1].id)
		).toMatchObject(metadataToAttachToStep);
		expect(currentState.currentStep).toBe(workflowTemplate.steps[0].id);

		// Go To Step
		const prevStepId = currentState.currentStep;
		const nextStepId =
			workflowTemplate.steps[workflowTemplate.steps.length - 1].id;

		workflow.goToStep(nextStepId, {
			customMetadataField: "customMetadataValue",
		});

		currentState = workflow.getCurrentState();

		expect(workflow.getStepMetadata(prevStepId)).toMatchObject({
			customMetadataField: "customMetadataValue",
		});
		expect(currentState.currentStep).toBe(nextStepId);

		workflow.setStepMetadata(nextStepId, { newMetadataBits: 123 });

		expect(workflow.getStepMetadata(nextStepId)).toMatchObject({
			newMetadataBits: 123,
		});
	});

	test("Execution sequence should work as expected", async () => {
		const workflow = new Workflow(workflowTemplate).loadCurrentState();

		expect(workflow.getCurrentState().executionSequence.length).toBe(1);
		expect(workflow.getCurrentState().executionSequence[0]).toBe("enterPhoneNumberStep");

		workflow.goToStep("sendingOTPStage");

		expect(workflow.getCurrentState().executionSequence.length).toBe(2);
		expect(workflow.getCurrentState().executionSequence[0]).toBe("enterPhoneNumberStep");
		expect(workflow.getCurrentState().executionSequence[1]).toBe("sendingOTPStage");
	});

	test("Resolver registration and getters", async () => {
		const workflow = new Workflow(workflowTemplate).loadCurrentState();

		const resolver = () => null;

		workflow.registerResolver("sendOTPStage", resolver);

		expect(workflow.getRegisteredResolverForStep("sendOTPStage")).toBe(
			resolver
		);
	});
});
