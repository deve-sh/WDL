import { WorkflowCurrentState, WorkflowInitOptions } from "../../types";
import { RequestArgs } from "../../types/ServerSideWorkflowStep";

import parseAndResolveTemplateString from "./parseAndResolveTemplateString";

export default async function request(
	args: RequestArgs,
	metadata: WorkflowCurrentState["metadata"],
	env: WorkflowInitOptions["environmentContext"]
) {
	let failed = false;
	let errorMessage = "";
	let response: Response | any = null;

	try {
		const headers = JSON.parse(
			parseAndResolveTemplateString(
				JSON.stringify({ "content-type": "application/json", ...args.headers }),
				{ ...metadata, env }
			)
		);
		const body = parseAndResolveTemplateString(JSON.stringify(args.body), {
			steps: metadata,
			env,
		});

		response = await fetch(args.endpoint, {
			method: args.method || "get",
			headers: headers,
			body: body,
		});
		if (!response.ok) failed = true;
		response = await response.json();
	} catch (error) {
		failed = true;
		errorMessage = error.message;
	}

	return { failed, errorMessage, response };
}
