import React from "react";
import { Handle, Position } from "reactflow";
import { Flex } from "@chakra-ui/react";

import CommonNodeWrapper from "./CommonNodeWrapper";
import BlockFace from "./BlockFace";

const IfElseBlock = React.memo(() => {
	return (
		<CommonNodeWrapper>
			<BlockFace nodePrimaryLabel="Condition" />
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
				style={{ left: "25%", background: "green" }}
			/>
			<Handle
				type="source"
				id="onFalse"
				position={Position.Bottom}
				style={{ left: "75%", background: "red" }}
			/>
		</CommonNodeWrapper>
	);
});
export default IfElseBlock;
