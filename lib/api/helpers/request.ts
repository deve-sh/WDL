import { RequestArgs } from "../../types/RequestOrResolverWorkflowStep";

import parseAndResolveTemplateString from "./parseAndResolveTemplateString";

export default async function request(
	args: RequestArgs,
	variables: Record<string, any>
) {
	let failed = false;
	let errorMessage = "";
	let response: Response | any = null;

	try {
		const headers =
			typeof args.headers !== "string"
				? JSON.parse(
						parseAndResolveTemplateString(
							JSON.stringify({
								"content-type": "application/json",
								...args.headers,
							}),
							variables
						)
				  )
				: JSON.parse(parseAndResolveTemplateString(args.headers, variables));

		const body =
			typeof args.body !== "string"
				? parseAndResolveTemplateString(JSON.stringify(args.body), variables)
				: parseAndResolveTemplateString(args.body, variables);

		let fetcher: Window["fetch"];

		if (typeof window === "undefined")
			fetcher = (await import("isomorphic-fetch")).default;
		else fetcher = window.fetch;

		response = await fetcher(
			parseAndResolveTemplateString(args.endpoint, variables),
			{
				method: args.method || "get",
				headers: headers,
				body: body,
			}
		);
		if (!response.ok) failed = true;
		try {
			response = await response.json();
		} catch {
			try {
				response = await response.text();
			} catch {
				response = null;
			}
		}
	} catch (error: Error | unknown) {
		failed = true;
		errorMessage = (error as Error).message;
	}

	return { failed, errorMessage, response };
}
