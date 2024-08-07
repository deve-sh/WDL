import { useCallback, useMemo } from "react";
import { type Node, useNodeId } from "reactflow";

import useWorkflowStore from "../store";

const useCurrentNodeMetadata = () => {
	const { nodes, setNodes } = useWorkflowStore();

	const nodeId = useNodeId();

	const node = useMemo(
		() => nodes.find((node) => node.id === nodeId),
		[nodes, nodeId]
	);

	const setMetadata = useCallback(
		(newMetadata: Node["data"]) => {
			if (!node) return;
			setNodes(
				nodes.map((existingNode) =>
					existingNode.id === node.id
						? { ...existingNode, data: newMetadata }
						: existingNode
				)
			);
		},
		[nodes, setNodes, node]
	);

	return [node ? node.data : {}, setMetadata];
};

export default useCurrentNodeMetadata;
