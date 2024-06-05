import React from "react";
import { useNodeId } from "reactflow";

const CommonNodeWrapper = ({ children }: { children: React.ReactNode }) => {
	const nodeId = useNodeId();

	return (
		<div className="workflow-builder-node" data-id={nodeId}>
			{children}
		</div>
	);
};

export default CommonNodeWrapper;
