import {
	useEffect,
	useState,
	useRef,
	type DragEvent,
	useCallback,
	useMemo,
} from "react";
import ReactFlow, {
	Background,
	Controls,
	ConnectionLineType,
	ReactFlowProvider,
	ReactFlowInstance,
	MiniMap,
	type NodeMouseHandler,
} from "reactflow";

import "reactflow/dist/style.css";

import BlockDataEditor from "./components/BlockDataEditor";

import nodeTypes from "./blocks/node-types";

import useWorkflowStore from "./store";
import useDragAndDrop from "./hooks/use-drag-and-drop";
import useCopyAndPasteNode from "./hooks/use-copy-and-paste-node";

import "./builder-styles.css";
import ContextMenu from "./components/NodeContextMenu";
import { MdCopyAll } from "react-icons/md";

type Props = {
	readOnly?: boolean;
};

function Builder({ readOnly }: Props) {
	const {
		nodes,
		edges,
		editingMetadataFor,
		isEditable,
		setEditingMetadataFor,
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
	const { copy: copyNode } = useCopyAndPasteNode(
		reactFlowInstance as ReactFlowInstance,
		reactFlowWrapper.current as HTMLDivElement
	);

	const [nodeContextMenuProps, setNodeContextMenuProps] = useState<{
		nodeId: string;
		x: number;
		y: number;
	} | null>(null);

	const onNodeContextMenu: NodeMouseHandler = useCallback((event, node) => {
		event.preventDefault();
		event.stopPropagation();
		setNodeContextMenuProps({
			x: event.pageX,
			y: event.pageY,
			nodeId: node.id,
		});
	}, []);

	const contextMenuActions = useMemo(
		() => [
			{
				id: "copy",
				text: "Copy",
				onClick: () => copyNode(nodeContextMenuProps?.nodeId as string),
				icon: <MdCopyAll />,
			},
		],
		[nodeContextMenuProps, copyNode]
	);

	const closeContextMenu = useCallback(() => {
		setNodeContextMenuProps(null);
	}, []);

	const toggleNodeMetadataEditor: NodeMouseHandler = useCallback(
		(_, nodeToEdit) => {
			if (isEditable && nodeToEdit && nodeToEdit.type !== "start")
				setEditingMetadataFor(nodeToEdit.id);
		},
		[isEditable, setEditingMetadataFor]
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
				onNodeClick={toggleNodeMetadataEditor}
				onNodeContextMenu={onNodeContextMenu}
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
			{!!nodeContextMenuProps && (
				<ContextMenu
					x={nodeContextMenuProps.x}
					y={nodeContextMenuProps.y}
					actions={contextMenuActions}
					nodeId={nodeContextMenuProps.nodeId}
					close={closeContextMenu}
				/>
			)}
		</ReactFlowProvider>
	);
}

export default Builder;
