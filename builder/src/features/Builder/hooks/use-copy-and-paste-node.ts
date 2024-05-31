import { useEffect, useCallback, useState, useRef } from "react";
import { Node, NodeMouseHandler, ReactFlowInstance } from "reactflow";
import { v4 as uuid } from "uuid";

import useWorkflowStore from "../store";

const useCopyAndPasteNode = (
	reactFlowInstance: ReactFlowInstance,
	reactFlowWrapper: HTMLDivElement
) => {
	const { nodes, setNodes } = useWorkflowStore();

	const mousePosition = useRef({ x: 0, y: 0 });

	const [nodeClickedOn, setNodeClickedOn] = useState<Node | null>(null);
	const nodeClickedOnDOM = useRef<Element | null>(null);

	const onNodeClick: NodeMouseHandler = (event, node) => {
		const nodes = document.getElementsByClassName("react-flow__node");
		let nodeContainingClick;
		for (let i = 0; i < nodes.length; i++) {
			// @ts-expect-error event.target is a valid operand for .contains
			if (nodes[i].contains(event.target)) nodeContainingClick = nodes[i];
		}

		nodeClickedOnDOM.current = nodeContainingClick || null;
		// Start and response nodes can't be copied.
		if (node.type === "start" || node.type === "response") return;
		setNodeClickedOn(node);
	};

	const paste = useCallback(
		async (event: ClipboardEvent) => {
			try {
				const clipboardData = event.clipboardData?.getData("text/plain");
				if (!clipboardData) return;

				const parsedJSON = JSON.parse(clipboardData);
				if (parsedJSON.nodeCopied) {
					event.preventDefault();

					const newNodeId = uuid();

					const reactFlowBounds = reactFlowWrapper.getBoundingClientRect();

					const position = reactFlowInstance.project({
						x: mousePosition.current.x - reactFlowBounds.left,
						y: mousePosition.current.y - reactFlowBounds.top,
					});

					const nodeProperties = parsedJSON.nodeCopied;

					const newNode: Node = {
						...nodeProperties,
						position,
						id: newNodeId,
					};
					setNodes([...nodes, newNode]);

					setNodeClickedOn(null);
				}
			} catch {
				// noop
			}
		},
		[nodes, setNodes, reactFlowInstance, reactFlowWrapper]
	);

	const copy = useCallback(
		async (event: ClipboardEvent) => {
			const nodeIsFocused = document.activeElement === nodeClickedOnDOM.current;
			if (nodeIsFocused) {
				event.preventDefault();
				const nodeId =
					nodeClickedOn?.id ||
					nodeClickedOnDOM.current?.getAttribute("data-id");

				if (!nodeId) return;

				const nodeCopied = nodes.find((node) => node.id === nodeId);
				await navigator.clipboard.writeText(JSON.stringify({ nodeCopied }));
			}
		},
		[nodeClickedOn, nodes]
	);

	useEffect(() => {
		const onMouseMove = (event: MouseEvent) => {
			mousePosition.current = { x: event.pageX, y: event.pageY };
		};

		window.addEventListener("copy", copy);
		window.addEventListener("paste", paste);
		window.addEventListener("mousemove", onMouseMove);
		return () => {
			window.removeEventListener("copy", copy);
			window.removeEventListener("paste", paste);
			window.removeEventListener("mousemove", onMouseMove);
		};
	}, [paste, copy, nodeClickedOn]);

	return { onNodeClick };
};

export default useCopyAndPasteNode;
