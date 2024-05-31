import type { WorkflowDefinitionSchema } from "../../../lib/types/index";

const workflowTemplate: WorkflowDefinitionSchema = {
	id: "sample-workflow",
	steps: [
		{
			type: "interactive-step",
			id: "enterPhoneNumberStep",
			name: "Phone Number Entering Step",
			heading: "Enter Your Phone Number",
			inputs: [
				{
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
								"!!steps.enterPhoneNumberStep.phoneNumber || steps.enterPhoneNumberStep.phoneNumber.length < 10",
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
				body: {
					phoneNumber: "{{ steps.enterPhoneNumberStep.inputs.phoneNumber }}",
				},
				onSuccess: { targetStep: "verifyOTPStep" },
				onError: { targetStep: "enterPhoneNumberStep" },
			},
		},
	],
};

export default workflowTemplate;
