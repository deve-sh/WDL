const processEvaluation = (
	evaluationString: string,
	variables: Record<string, any>
) => {
	// TODO: Probably sanitize JS code? This is equivalent of an "eval" statement
	let expressionToEvaluate = ``;

	const variableNames = Object.keys(variables || {});

	for (const name of variableNames)
		expressionToEvaluate += `const ${name} = ${JSON.stringify(
			variables[name] || {}
		)};\n`;

	expressionToEvaluate += `${evaluationString}`;

	const evaluationFunction = new Function(expressionToEvaluate);
	const outputOfEvaluation = evaluationFunction();

	return outputOfEvaluation;
};

export default processEvaluation;
