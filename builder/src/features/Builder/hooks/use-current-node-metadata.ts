import { useNodeId } from "reactflow";
import useWorkflowStore from "../store";
import { useMemo } from "react";

const useCurrentNodeMetadata = () => {
	const { nodes } = useWorkflowStore();

	const nodeId = useNodeId();

	const node = useMemo(() => nodes.find((node) => node.id === nodeId), [nodes, nodeId]);

	return node ? node.data : {};
};

export default useCurrentNodeMetadata;
