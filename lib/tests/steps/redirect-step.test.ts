import { describe, expect, it } from "@jest/globals";
import Workflow from "../../api";
import workflowTemplate from "../mocks/sampleWorkflow";

describe("Redirection/OAuth-Flow Step tests", () => {
	it("should resolve interpolated values correctly & redirect client correctly to the final url automatically", async () => {
		// @ts-expect-error Filling in a window mock for the server environment without an additional library
		global.window = { location: { href: "" } };

		const oAuthURL = "http://localhost:8080/redirectToKyc/";
		const oAuthClientId = "abcdef";

		const workflow = new Workflow(workflowTemplate, {
			environmentContext: {
				variables: { oAuthClientId: oAuthClientId },
			},
		}).loadCurrentState({
			currentStep: "startOAuthStep",
			metadata: {
				general: {},
				redirectURLComputer: { finalURL: oAuthURL },
			},
		});

		await workflow.processCurrentStep();

		expect(global.window.location.href.toString()).toBe(
			oAuthURL + "?clientId=" + oAuthClientId
		);
	});

	it("should require a resolver for the action to be processed on the server", async () => {
		const workflow = new Workflow(workflowTemplate).loadCurrentState({
			currentStep: "startOAuthStep",
			metadata: { general: {} },
		});

		try {
			await workflow.processCurrentStep();
		} catch (error: unknown | Error) {
			expect((error as Error).message).toMatch(
				"does not have a valid action or resolver"
			);
		}
	});

	it("should invoke resolver for the redirect step to be processed on the server", async () => {
		const workflow = new Workflow(workflowTemplate).loadCurrentState({
			currentStep: "startOAuthStep",
			metadata: { general: {} },
		});

		let resolverCalled = false;

		workflow.registerResolver("startOAuthStep", () => {
			resolverCalled = true;
		});

		await workflow.processCurrentStep();
		expect(resolverCalled).toBe(true);
	});
});
