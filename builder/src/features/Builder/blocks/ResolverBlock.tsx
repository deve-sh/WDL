import React from "react";
import { Handle, Position } from "reactflow";

import CommonNodeWrapper from "./CommonNodeWrapper";
import BlockFace from "./BlockFace";

const ResolverBlock = React.memo(() => {
	return (
		<CommonNodeWrapper>
			<BlockFace nodePrimaryLabel="Resolver" />
			<Handle type="target" position={Position.Top} />
			<Handle type="source" position={Position.Bottom} />
		</CommonNodeWrapper>
	);
});
export default ResolverBlock;
