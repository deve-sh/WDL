import React from "react";
import { Handle, Position } from "reactflow";
import { Text } from "@chakra-ui/react";

import CommonNodeWrapper from "./CommonNodeWrapper";

const EvaluateExpressionBlock = React.memo(() => {
	return (
		<CommonNodeWrapper>
			<Text>Evaluate Expression</Text>
			<Handle type="target" position={Position.Top} />
			<Handle type="source" position={Position.Bottom} />
		</CommonNodeWrapper>
	);
});
export default EvaluateExpressionBlock;
