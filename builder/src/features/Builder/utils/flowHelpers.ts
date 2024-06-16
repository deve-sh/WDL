import type { Edge, Node } from "reactflow";

export const getEdgesForNode = (currentNode: Node, edges: Edge[]) => {
	const edgesForThisBlock = edges.filter(
		(edge) => edge.source === currentNode.id
	);
	return edgesForThisBlock;
};

export const isNodeConnectedToAnyOtherNodes = (
	currentNode: Node,
	edges: Edge[]
) => {
	const edgesToAndFromThisBlock = edges.filter(
		(edge) => edge.source === currentNode.id || edge.target === currentNode.id
	);
	return edgesToAndFromThisBlock;
};
