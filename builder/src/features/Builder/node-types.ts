import StartBlock from "./blocks/StartBlock";
import ResolverBlock from "./blocks/ResolverBlock";
import InteractiveInputStep from "./blocks/InteractiveInputBlock";
import RequestBlock from "./blocks/RequestBlock";
import EvaluateExpressionBlock from "./blocks/EvaluateExpressionBlock";
import IfElseBlock from "./blocks/IfElseBlock";

const nodeTypes = {
	start: StartBlock,
	resolver: ResolverBlock,
	"interactive-input": InteractiveInputStep,
	request: RequestBlock,
	evaluate: EvaluateExpressionBlock,
	"if-else": IfElseBlock,
};

export default nodeTypes;
