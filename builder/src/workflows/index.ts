const workflowTemplate = {
	version: 1,
	id: "ecofy-loan-partner-integration",
	steps: [
		{
			// Use this id to refer to this step in other steps, similar to GitHub Workflows
			id: "consentStage",
			participant: "customer", // Show step to user on the frontend
			heading: "Start Your Loan Application",
			desc: "",
			inputs: [
				{
					type: "tel",
					required: true,
					text: "Enter your phone number",
					id: "phoneNumber",
				},
				{
					type: "checkbox",
					required: true,
					text: "<consent form text>",
					id: "consentGiven",
				},
			],
			actions: [
				{
					type: "button",
					id: "submit",
					attributes: {
						primary: true,
						type: "submit",
						label: "Generate OTP",
					},
					onSuccess: { targetStep: "generateOtp" },
					validations: [
						{
							condition: "!!steps.consentStage.inputs.phoneNumber",
							errorMessage: "Please enter your phone number",
						},
						{
							condition: "!!steps.consentStage.inputs.consentGiven",
							errorMessage: "Please check the consent checkbox",
						},
					],
				},
			],
		},
		{
			id: "generateOtp",
			participant: "server", // Run this block from our server
			nRetries: 1,
			heading: "Generating OTP for you",
			desc: "",
			action: {
                type: 'request',
				// Define this based on the postman collection you get
				endpoint: "http://localhost:5000/abc",
				method: "POST",
				headers: {
					authorization: "Basic {{ env.api_key }}",
				},
				body: {
					phoneNumber: "{{ steps.consentStage.inputs.phoneNumber }}",
				},
			},
		},
		{
			id: "enterOtp",
			participant: "customer",
			heading: "Please Enter The OTP Received",
			inputs: [
				{
					type: "number",
					required: true,
					text: "Enter the OTP received on your phone",
					id: "otp",
				},
			],
			actions: [
				{
					type: "button",
					attributes: {
						primary: true,
						type: "submit",
						label: "Verify OTP",
					},
					validations: [
						{
							condition: "!steps.consentStage.inputs.phoneNumber",
							errorMessage: "Please enter the OTP received",
						},
					],
				},
				{
					type: "button",
					attributes: {
						label: "Resend OTP",
					},
					validations: [],
					// Take user back to consent stage where they can enter the phone number and generate the OTP again
					onSuccess: { action: "goBack", targetStep: "consentStage" },
				},
			],
		},
		{
			id: "verifyOtp",
			participant: "server",
			nRetries: 1,
			heading: "Verifying your OTP",
			desc: "",
			requests: [
				{
					endpoint: "https://ecofy-endpoint...",
					method: "POST",
					headers: {
						authorization:
							"Basic {{globalConfig.loan_providers.ecofy_api_key}}",
					},
					body: {
						phoneNumber: "{{steps.consentStage.inputs.phoneNumber}}",
						otp: "{{steps.enterOtp.inputs.otp}}",
					},
				},
			],
		},
	],
};

const initWorkflow = async () => {
	const Workflow = (await import("lib/api/Workflow")).default;

	// @ts-expect-error Yo!
	const workflow = new Workflow(workflowTemplate, {
		participant: "server",
		environmentContext: { api_key: "abcdef" },
	});

	// @ts-expect-error Yo!
	window.workflow = workflow;

	workflow.loadCurrentState();

	console.log(workflow);
};

export default initWorkflow;
