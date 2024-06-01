import { describe, expect, it } from "@jest/globals";

import Workflow from "../api";

import workflowTemplate from "./mocks/sampleWorkflow";

describe("Sanity Basic tests for Library's exposed API", () => {
	it("should throw an error on incorrect initialization", async () => {
		// No arguments
		// @ts-expect-error Testing invalid cases
		expect(() => new Workflow()).toThrow(
			"Workflow: Invalid Workflow initialization"
		);

		// Missing steps length
		// @ts-expect-error Testing invalid cases
		expect(() => new Workflow({ id: "abc" })).toThrowError(
			"Workflow: Invalid Workflow initialization: Steps or ID of the Workflow not defined"
		);

		// Missing id
		// @ts-expect-error Testing invalid cases
		expect(() => new Workflow({ steps: [{ a: 1 }] })).toThrowError(
			"Workflow: Invalid Workflow initialization: Steps or ID of the Workflow not defined"
		);

		expect(() => new Workflow(workflowTemplate)).not.toThrow();
	});

	it("should have all the required functions as per the API Spec", async () => {
		const envContext = { runningIn: "jest-env" };
		const workflow = new Workflow(workflowTemplate, {
			environmentContext: envContext,
		});

		expect(workflow.options).toBeDefined();
		expect(workflow.options.environmentContext).toMatchObject(envContext);
		expect(workflow.options.resolvers).toMatchObject({});

		expect(workflow.loadCurrentState).toBeInstanceOf(Function);
		expect(workflow.getCurrentStep).toBeInstanceOf(Function);
		expect(workflow.getCurrentState).toBeInstanceOf(Function);
		expect(workflow.getStepMetadata).toBeInstanceOf(Function);
		expect(workflow.setStepMetadata).toBeInstanceOf(Function);
		expect(workflow.goToStep).toBeInstanceOf(Function);
		expect(workflow.goAhead).toBeInstanceOf(Function);
		expect(workflow.goBack).toBeInstanceOf(Function);
		expect(workflow.getRegisteredResolverForStep).toBeInstanceOf(Function);
		expect(workflow.registerResolver).toBeInstanceOf(Function);
		expect(workflow.validateStepAction).toBeInstanceOf(Function);
		expect(workflow.processCurrentStep).toBeInstanceOf(Function);
	});

	it("should throw error on not loading initial/current state", async () => {
		const workflow = new Workflow(workflowTemplate);

		// Initially the currentState should be undefined
		expect(workflow.currentState).toMatchObject({
			currentStep: "",
			metadata: { general: {} },
		});

		expect(() => workflow.throwIfCurrentStateNotLoaded()).toThrowError(
			"Workflow: Current State of Workflow not loaded via workflow.loadCurrentState"
		);

		expect(() => workflow.getCurrentStep()).toThrow();

		// Load current state
		workflow.loadCurrentState();

		expect(() => workflow.getCurrentStep()).not.toThrow();
		expect(workflow.getCurrentStep()?.id).toEqual(workflowTemplate.steps[0].id);
	});
});
