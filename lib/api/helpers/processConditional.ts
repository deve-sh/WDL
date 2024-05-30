import { WorkflowInitOptions } from "../../types";

const processConditional = (
	conditionString: string,
	currentStateMetadata: Record<string, any>,
	environmentContext: WorkflowInitOptions["environmentContext"]
) => {
	// TODO: Probably sanitize JS code? This is equivalent of an "eval" statement
	const conditionExpressionToEvaluate = `
        const env = ${JSON.stringify(environmentContext || {})};
        const steps = ${JSON.stringify(currentStateMetadata || {})};
        return (${conditionString});
    `;

	const evaluationFunction = new Function(conditionExpressionToEvaluate);
	const outputOfEvaluation = evaluationFunction();

	return outputOfEvaluation;
};

export default processConditional;
