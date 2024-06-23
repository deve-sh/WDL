import { useEffect, useCallback, useRef } from "react";
import { Node, ReactFlowInstance } from "reactflow";
import { useToast } from "@chakra-ui/react";
import { v4 as uuid } from "uuid";

import useWorkflowStore from "../store";

const useCopyAndPasteNode = (
	reactFlowInstance: ReactFlowInstance,
	reactFlowWrapper: HTMLDivElement
) => {
	const { nodes, setNodes } = useWorkflowStore();
	const toast = useToast();

	const mousePosition = useRef({ x: 0, y: 0 });

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
				}
			} catch {
				// noop
			}
		},
		[nodes, setNodes, reactFlowInstance, reactFlowWrapper]
	);

	const copy = useCallback(
		async (nodeId: string) => {
			if (!nodeId) return;

			const nodeCopied = nodes.find((node) => node.id === nodeId);
			await navigator.clipboard.writeText(JSON.stringify({ nodeCopied }));

			toast({ title: "Node Copied. Use Ctrl + V to paste", status: "info" });
		},
		[nodes, toast]
	);

	useEffect(() => {
		const onMouseMove = (event: MouseEvent) => {
			mousePosition.current = { x: event.pageX, y: event.pageY };
		};

		window.addEventListener("paste", paste);
		window.addEventListener("mousemove", onMouseMove);
		return () => {
			window.removeEventListener("paste", paste);
			window.removeEventListener("mousemove", onMouseMove);
		};
	}, [paste, copy]);

	return { copy };
};

export default useCopyAndPasteNode;
