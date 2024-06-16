import React from "react";
import { Handle, Position } from "reactflow";
import { Text } from "@chakra-ui/react";

import CommonNodeWrapper from "./CommonNodeWrapper";

const RequestBlock = React.memo(() => {
	return (
		<CommonNodeWrapper>
			<Text>Send A Request</Text>
			<Handle type="target" position={Position.Top} />
			<Handle type="source" position={Position.Bottom} />
		</CommonNodeWrapper>
	);
});
export default RequestBlock;
