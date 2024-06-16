import StartBlock from "./StartBlock";
import ResolverBlock from "./ResolverBlock";
import InteractiveInputStep from "./InteractiveInputBlock";
import RequestBlock from "./RequestBlock";
import EvaluateExpressionBlock from "./EvaluateExpressionBlock";
import IfElseBlock from "./IfElseBlock";

const nodeTypes = {
	start: StartBlock,
	resolver: ResolverBlock,
	"interactive-input": InteractiveInputStep,
	request: RequestBlock,
	evaluate: EvaluateExpressionBlock,
	"if-else": IfElseBlock,
};

export default nodeTypes;
