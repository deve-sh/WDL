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
				{ steps: metadata, env }
			)
		);
		const body = parseAndResolveTemplateString(JSON.stringify(args.body), {
			steps: metadata,
			env,
		});

		let fetcher: typeof import("node-fetch")["default"] | Window["fetch"];

		if (typeof window === "undefined")
			fetcher = (await import("node-fetch")).default;
		else fetcher = window.fetch;

		response = await fetcher(args.endpoint, {
			method: args.method || "get",
			headers: headers,
			body: body,
		});
		if (!response.ok) failed = true;
		response = await response.json();
	} catch (error: Error | unknown) {
		failed = true;
		errorMessage = (error as Error).message;
	}

	return { failed, errorMessage, response };
}
