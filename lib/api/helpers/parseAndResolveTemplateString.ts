import Handlebars from "handlebars";

const parseAndResolveTemplateString = (
	strToResolve: string,
	variables: Record<string, any>
) => {
	const stringTemplateResolver = Handlebars.compile(strToResolve);
	// resolving strings with variables or js expressions
	return stringTemplateResolver(variables);
};

export default parseAndResolveTemplateString;
