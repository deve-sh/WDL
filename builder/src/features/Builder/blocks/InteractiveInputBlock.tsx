import React from "react";
import { Handle, Position } from "reactflow";

import CommonNodeWrapper from "./CommonNodeWrapper";
import BlockFace from "./BlockFace";

const InteractiveInputStep = React.memo(() => {
	return (
		<CommonNodeWrapper>
			<BlockFace nodePrimaryLabel="Interactive Step" />
			<Handle type="target" position={Position.Top} />
			<Handle type="source" position={Position.Bottom} />
		</CommonNodeWrapper>
	);
});
export default InteractiveInputStep;
