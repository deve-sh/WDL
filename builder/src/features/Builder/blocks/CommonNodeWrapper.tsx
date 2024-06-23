import React, { useCallback } from "react";
import { useNodeId } from "reactflow";

import useWorkflowStore from "../store";

const CommonNodeWrapper = ({ children }: { children: React.ReactNode }) => {
	const nodeId = useNodeId();
	const { isEditable, setEditingMetadataFor, nodes } = useWorkflowStore();

	const toggleEditor = useCallback(() => {
		const nodeToEdit = nodes.find((node) => node.id === nodeId);
		if (
			nodeToEdit &&
			nodeToEdit.type !== "start" &&
			nodeToEdit.type !== "resolver"
		)
			setEditingMetadataFor(nodeId);
	}, [nodeId]);

	return (
		<div
			className="workflow-builder-node"
			data-id={nodeId}
			onClick={isEditable ? toggleEditor : undefined}
		>
			{children}
		</div>
	);
};

export default CommonNodeWrapper;
