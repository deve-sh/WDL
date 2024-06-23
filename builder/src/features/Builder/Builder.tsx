import { useEffect, useState, useRef, type DragEvent } from "react";
import ReactFlow, {
	Background,
	Controls,
	ConnectionLineType,
	ReactFlowProvider,
	ReactFlowInstance,
	MiniMap,
} from "reactflow";

import "reactflow/dist/style.css";

import BlockDataEditor from "./components/BlockDataEditor";

import nodeTypes from "./blocks/node-types";

import useWorkflowStore from "./store";
import useDragAndDrop from "./hooks/use-drag-and-drop";
import useCopyAndPasteNode from "./hooks/use-copy-and-paste-node";

import "./builder-styles.css";

type Props = {
	readOnly?: boolean;
};

function Builder({ readOnly }: Props) {
	const {
		nodes,
		edges,
		editingMetadataFor,
		onNodesChange,
		onEdgesChange,
		onConnect,
	} = useWorkflowStore();

	const reactFlowWrapper = useRef<HTMLDivElement | null>(null);
	const [reactFlowInstance, setReactFlowInstance] =
		useState<ReactFlowInstance>();

	useEffect(() => {
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.ctrlKey && event.key === "s") {
				event.preventDefault();
				// TODO: Save Workflow State
			}
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, []);

	// Dragging components from sidebar
	const onDragOver = (event: DragEvent) => {
		event.preventDefault();
		event.dataTransfer.dropEffect = "move";
	};
	const { onDrop } = useDragAndDrop(
		reactFlowWrapper,
		reactFlowInstance as ReactFlowInstance
	);

	// Copy pasting of node (Without edges of course)
	const { onNodeClick } = useCopyAndPasteNode(
		reactFlowInstance as ReactFlowInstance,
		reactFlowWrapper.current as HTMLDivElement
	);

	return (
		<ReactFlowProvider>
			<ReactFlow
				ref={reactFlowWrapper}
				nodes={nodes}
				edges={edges}
				fitView
				connectionLineType={ConnectionLineType.SmoothStep}
				onNodesChange={onNodesChange}
				onEdgesChange={onEdgesChange}
				onConnect={onConnect}
				nodeTypes={nodeTypes}
				deleteKeyCode={["Backspace", "Delete"]}
				onDragOver={onDragOver}
				// @ts-expect-error DropEvent is not exported by React Flow but matches the signature we need
				onDrop={onDrop}
				onInit={setReactFlowInstance}
				onNodeClick={onNodeClick}
				elementsSelectable={!readOnly}
				nodesConnectable={!readOnly}
				nodesDraggable
			>
				<Background />
				<Controls
					position="bottom-left"
					showInteractive={false}
					showZoom={false}
				/>
				<MiniMap position="top-right" />
			</ReactFlow>

			{!!editingMetadataFor && <BlockDataEditor />}
		</ReactFlowProvider>
	);
}

export default Builder;
