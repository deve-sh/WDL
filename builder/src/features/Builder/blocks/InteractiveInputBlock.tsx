import React from "react";
import { Handle, Position } from "reactflow";
import { Text } from "@chakra-ui/react";

import CommonNodeWrapper from "./CommonNodeWrapper";

const InteractiveInputStep = React.memo(() => {
	return (
		<CommonNodeWrapper>
			<Text>Interactive Input Step</Text>
			<Handle type="target" position={Position.Top} />
			<Handle type="source" position={Position.Bottom} />
		</CommonNodeWrapper>
	);
});
export default InteractiveInputStep;
