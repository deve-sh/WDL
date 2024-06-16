import React from "react";
import { Handle, Position } from "reactflow";
import { Flex, Text } from "@chakra-ui/react";

import CommonNodeWrapper from "./CommonNodeWrapper";

const RequestBlock = React.memo(() => {
	return (
		<CommonNodeWrapper>
			<Text>Send A Request</Text>
			<Handle type="target" position={Position.Top} />
			<Flex>
				<div
					style={{
						position: "relative",
						left: "-10%",
						fontSize: "8px",
					}}
				>
					Success
				</div>
				<div
					style={{
						position: "relative",
						left: "65%",
						fontSize: "8px",
					}}
				>
					Failure
				</div>
			</Flex>
			<Handle
				type="source"
				position={Position.Bottom}
				id="onSuccess"
				style={{ left: "25%" }}
			/>
			<Handle
				type="source"
				id="onError"
				position={Position.Bottom}
				style={{ left: "75%" }}
			/>
		</CommonNodeWrapper>
	);
});
export default RequestBlock;
