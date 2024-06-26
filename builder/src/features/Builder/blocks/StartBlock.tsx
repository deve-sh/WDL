import React from "react";
import { Handle, Position } from "reactflow";
import { Text } from "@chakra-ui/react";

import CommonNodeWrapper from "./CommonNodeWrapper";

const StartBlock = React.memo(() => {
	return (
		<CommonNodeWrapper>
			<Text>Start</Text>
			<Handle type="source" position={Position.Bottom} />
		</CommonNodeWrapper>
	);
});
export default StartBlock;
