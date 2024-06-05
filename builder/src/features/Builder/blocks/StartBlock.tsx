import React from "react";
import {
	Handle,
	// NodeProps,
	Position,
} from "reactflow";
import { HStack, Text, Tooltip } from "@chakra-ui/react";

import CommonNodeWrapper from "./CommonNodeWrapper";

const StartBlock = React.memo(() =>
	// node: NodeProps
	{
		return (
			<CommonNodeWrapper>
				<Tooltip label="This is the starting point for your workflow">
					<Text>Start</Text>
				</Tooltip>
				<Handle type="source" position={Position.Bottom} />
			</CommonNodeWrapper>
		);
	}
);
export default StartBlock;
