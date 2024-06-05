const processEvaluation = (
	evaluationString: string,
	variables: Record<string, any>
) => {
	// TODO: Probably sanitize JS code? This is equivalent of an "eval" statement
	let conditionExpressionToEvaluate = ``;

	const variableNames = Object.keys(variables || {});

	for (const name of variableNames)
		conditionExpressionToEvaluate += `const ${name} = ${JSON.stringify(
			variables[name] || {}
		)};\n`;

	conditionExpressionToEvaluate += `${evaluationString}`;

	const evaluationFunction = new Function(conditionExpressionToEvaluate);
	const outputOfEvaluation = evaluationFunction();

	return outputOfEvaluation;
};

export default processEvaluation;
