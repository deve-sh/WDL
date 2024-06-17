import { describe, expect, it } from "@jest/globals";

import type { WorkflowCurrentState } from "../../types";
import type {
	RequestAction,
	RequestOrResolverWorkflowStep,
} from "../../types/RequestOrResolverWorkflowStep";

import Workflow from "../../api";
import workflowTemplate from "../mocks/sampleWorkflow";

describe("Tests for request/resolver steps", () => {
	it("should throw if a step doesn't have a resolver specified", async () => {
		const workflow = new Workflow(workflowTemplate).loadCurrentState({
			currentStep: "webhookStep",
			metadata: { general: {} },
			executionSequence: [],
		});

		try {
			await workflow.processCurrentStep();
		} catch (error: unknown | Error) {
			expect((error as Error).message).toMatch(
				"does not have a valid action or resolver"
			);
		}
	});

	it("should invoke resolver for a step and resolver should take prcedence over default action", async () => {
		let resolverCalled = false;

		const workflow = new Workflow(workflowTemplate, {
			resolvers: {
				webhookStep: () => {
					resolverCalled = true;
				},
			},
		}).loadCurrentState({
			currentStep: "webhookStep",
			metadata: { general: {} },
			executionSequence: [],
		});

		await workflow.processCurrentStep();

		expect(resolverCalled).toBe(true);
	});

	it("should make a request for a step with request action defined + move the request according to the success of it", async () => {
		let requestArgs: [url: string, options: Record<string, any>];

		const mockRequestResponse = {
			ok: true,
			status: 200,
			message: "Response sent successfully",
		};

		global.window = {
			// @ts-expect-error Filling in a window mock for the server environment without an additional library
			fetch: async (...args) => {
				// @ts-expect-error
				requestArgs = args;

				// Mock a success
				return {
					ok: true,
					json: async () => mockRequestResponse,
				};
			},
		};

		const requestStepInWorkflowTemplate = workflowTemplate.steps.find(
			(step) => step.id === "sendingOTPStage"
		) as RequestOrResolverWorkflowStep;

		if (!requestStepInWorkflowTemplate) return;

		const workflow = new Workflow(workflowTemplate, {
			environmentContext: { otpApiKey: "abcdef" },
		}).loadCurrentState({
			currentStep: "sendingOTPStage",
			metadata: {
				general: {},
				enterPhoneNumberStep: { inputs: { phoneNumber: "1234567890" } },
			},
			executionSequence: [],
		});

		await workflow.processCurrentStep();

		// @ts-expect-error The variable is assigned a value on execution.
		const argsReceivedInRequest = requestArgs as typeof requestArgs;

		expect(argsReceivedInRequest).toBeDefined();

		const action = requestStepInWorkflowTemplate.action as RequestAction;

		// Validate URL of the request
		expect(argsReceivedInRequest[0]).toBe(action.endpoint);

		// Validate Other bits of the request
		expect(argsReceivedInRequest[1].method).toBe(action.method);
		expect(argsReceivedInRequest[1].headers.authorization).toBe("abcdef");
		expect(JSON.parse(argsReceivedInRequest[1].body).phoneNumber).toBe(
			"1234567890"
		);

		// On Success handler should have been automatically called and the metadata should have been set correctly.
		const currentState = workflow.getCurrentState() as WorkflowCurrentState;
		expect(currentState.currentStep).toBe(action.onSuccess.targetStep);
		expect(currentState.metadata.sendingOTPStage.response).toBeDefined();
		expect(currentState.metadata.sendingOTPStage.response).toMatchObject(
			mockRequestResponse
		);
	});
});
