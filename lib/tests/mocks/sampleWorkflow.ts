import type { WorkflowDefinitionSchema } from "../../types/index";

const workflowTemplate: WorkflowDefinitionSchema = {
	id: "sample-workflow",
	steps: [
		{
			type: "interactive-step",
			id: "enterPhoneNumberStep",
			name: "Phone Number Entering Step",
			heading: "Enter Your Phone Number",
			blocks: [
				{
					type: "input",
					attributes: {
						type: "tel",
						label: "Enter your phone number",
						placeholder: "+91-1234567890",
					},
					id: "phoneNumber",
				},
			],
			actions: [
				{
					type: "button",
					id: "submitButton",
					attributes: {
						label: "Send OTP",
						type: "submit",
						primary: true,
					},
					validations: [
						{
							condition:
								"steps.enterPhoneNumberStep.inputs.phoneNumber && steps.enterPhoneNumberStep.inputs.phoneNumber.length >= 10",
							// If-false
							errorMessage: "Phone Number is not valid",
						},
					],
					onValidationSuccess: { targetStep: "sendingOTPStage" },
				},
			],
		},

		{
			type: "request-or-resolver",
			id: "sendingOTPStage",
			name: "Sending OTP to entered phone number",
			heading: "Sending OTP to your entered phone number",
			action: {
				type: "request",
				endpoint: "http://localhost:5000/sendOTPToPhoneNumber",
				method: "post",
				headers: {
					authorization: "{{ env.otpApiKey }}",
				},
				body: {
					phoneNumber: "{{ steps.enterPhoneNumberStep.inputs.phoneNumber }}",
				},
				onSuccess: { targetStep: "verifyOTPStep" },
				onError: { targetStep: "enterPhoneNumberStep" },
			},
		},

		{
			type: "request-or-resolver",
			id: "sendingOTPStageWithStringifiedHeaderAndBody",
			name: "Sending OTP to entered phone number",
			heading: "Sending OTP to your entered phone number",
			action: {
				type: "request",
				endpoint: "http://localhost:5000/sendOTPToPhoneNumber",
				method: "post",
				headers: '{ "authorization": "{{ env.otpApiKey }}" }',
				body: '{ "phoneNumber": "{{ steps.enterPhoneNumberStep.inputs.phoneNumber }}", "number": {{ steps.enterPhoneNumberStep.inputs.phoneNumber }} }',
				onSuccess: { targetStep: "verifyOTPStep" },
				onError: { targetStep: "enterPhoneNumberStep" },
			},
		},

		{
			type: "redirect",
			id: "startOAuthStep",
			name: "Start OAuth Step for KYC Process",
			heading: "Redirecting you to KYC Portal",
			description: "",
			url: "{{steps.redirectURLComputer.finalURL}}?clientId={{env.variables.oAuthClientId}}",
		},

		{
			type: "request-or-resolver",
			id: "webhookStep",
			name: "Receiving your data from the Webhook",
			heading: "Receiving your data from the Webhook",
			description: "",
			action: { type: "resolver" },
		},

		{
			id: "conditionalAssessmentStep",
			type: "condition",
			condition: "steps.sendingOTPStage.inputs.phoneNumber === '1234567890'",
			onTrue: { targetStep: "startOAuthStep" },
			onFalse: { targetStep: "webhookStep" },
			name: "Assessing the success of OTP input",
		},

		{
			id: "evaluationStep",
			type: "evaluation",
			expression:
				"const countryCode = '+91'; const phone = steps.sendingOTPStage.inputs.phoneNumber; return countryCode + phone;",
			onComplete: { targetStep: "startOAuthStep" },
			name: "Assessing inputs",
		},
	],
};

export default workflowTemplate;
