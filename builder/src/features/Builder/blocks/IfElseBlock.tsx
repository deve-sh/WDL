import React from "react";
import { Handle, Position } from "reactflow";
import { Flex, Text } from "@chakra-ui/react";

import CommonNodeWrapper from "./CommonNodeWrapper";

const IfElseBlock = React.memo(() => {
	return (
		<CommonNodeWrapper>
			<Text>Condition</Text>
			<Handle type="target" position={Position.Top} />
			<Flex>
				<div
					style={{
						position: "relative",
						left: "-10%",
						fontSize: "8px",
					}}
				>
					True
				</div>
				<div
					style={{
						position: "relative",
						left: "65%",
						fontSize: "8px",
					}}
				>
					False
				</div>
			</Flex>
			<Handle
				type="source"
				position={Position.Bottom}
				id="onTrue"
				style={{ left: "25%" }}
			/>
			<Handle
				type="source"
				id="onFalse"
				position={Position.Bottom}
				style={{ left: "75%" }}
			/>
		</CommonNodeWrapper>
	);
});
export default IfElseBlock;
