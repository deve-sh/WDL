import { RefObject, useCallback } from "react";
import { ReactFlowInstance } from "reactflow";
import { v4 as uuid } from "uuid";

import useWorkflowStore from "../store";

const useDragAndDrop = (
	reactFlowWrapper?: RefObject<HTMLDivElement | null>,
	reactFlowInstance?: ReactFlowInstance
) => {
	const { nodes, setNodes, setIsDirty } = useWorkflowStore();

	const onDragStart = (nodeType: string) => (event: DragEvent) => {
		if (!event.dataTransfer) return;
		event.dataTransfer.setData("application/reactflow", nodeType);
		event.dataTransfer.effectAllowed = "move";
	};

	const onDrop = useCallback(
		(event: DragEvent) => {
			event.preventDefault();
			if (
				!reactFlowWrapper?.current ||
				!reactFlowInstance ||
				!event.dataTransfer
			)
				return;

			const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
			const type = event.dataTransfer.getData("application/reactflow");

			if (!type) return;

			const position = reactFlowInstance.project({
				x: event.clientX - reactFlowBounds.left,
				y: event.clientY - reactFlowBounds.top,
			});
			const nodeId = uuid();
			setNodes([...nodes, { id: nodeId, type, position, data: {} }]);
			setTimeout(() => {
				const nodeOnDOM = document.querySelector(`[data-id="${nodeId}"]`);
				// Adjust position of node by 50% in both directions
				// This is done separately given we can't know the position and size of a DOM node until its actually in the DOM.
				if (!nodeOnDOM) return;
				const rect = nodeOnDOM.getBoundingClientRect();
				setNodes([
					...nodes,
					{
						id: nodeId,
						type,
						position: reactFlowInstance.project({
							x: event.clientX - reactFlowBounds.left - rect.width / 2,
							y: event.clientY - reactFlowBounds.top - rect.height / 2,
						}),
						data: {},
					},
				]);
			}, 0);
			setIsDirty(true);
		},
		[reactFlowInstance, setNodes, nodes, setIsDirty, reactFlowWrapper]
	);

	return { onDrop, onDragStart };
};

export default useDragAndDrop;
