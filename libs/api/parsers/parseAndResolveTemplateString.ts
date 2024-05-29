import Handlebars from "handlebars";

export const getVariables = (
	customEnvironmentVariables?: { key: string; value: string }[]
) => {
	const variables: Record<string, string> = {
		NODE_ENV: process.env.NODE_ENV || "development",
	};
	for (const variable of customEnvironmentVariables || [])
		variables[variable.key] = variable.value;
	return variables;
};

const parseAndResolveTemplateString = (
	strToResolve: string,
	environmentContext: Record<string, any>
) => {
	const stringTemplateResolver = Handlebars.compile(strToResolve);
	return stringTemplateResolver({
        // TODO: Fill in environment context and current state for
        // resolving strings with variables or js expressions
    });
};

export default parseAndResolveTemplateString;
