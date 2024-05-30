const processConditional = (
	conditionString: string,
	variables: Record<string, any>
) => {
	// TODO: Probably sanitize JS code? This is equivalent of an "eval" statement
	let conditionExpressionToEvaluate = ``;

	const variableNames = Object.keys(variables || {});

	for (const name of variableNames)
		conditionExpressionToEvaluate += `const ${name} = ${JSON.stringify(
			variables[name] || {}
		)};\n`;

	conditionExpressionToEvaluate += `return (${conditionString});`;

	const evaluationFunction = new Function(conditionExpressionToEvaluate);
	const outputOfEvaluation = evaluationFunction();

	return outputOfEvaluation;
};

export default processConditional;
