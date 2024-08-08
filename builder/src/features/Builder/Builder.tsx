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
	ControlButton,
} from "reactflow";

import "reactflow/dist/style.css";

import { MdCopyAll, MdUpload } from "react-icons/md";
import { IoMdTrash } from "react-icons/io";

import BlockDataEditor from "./components/BlockDataEditor";

import nodeTypes from "./blocks/node-types";

import useWorkflowStore from "./store";
import useDragAndDrop from "./hooks/use-drag-and-drop";
import useCopyAndPasteNode from "./hooks/use-copy-and-paste-node";

import "./builder-styles.css";
import ContextMenu from "./components/NodeContextMenu";

type Props = {
	readOnly?: boolean;
};

function Builder({ readOnly }: Props) {
	const {
		nodes,
		edges,
		editingMetadataFor,
		isEditable,
		setNodes,
		setEdges,
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

	const deleteNode = useCallback(
		(nodeId: string) => {
			setNodes(nodes.filter((node) => node.id !== nodeId));
			setEdges(
				edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
			);
		},
		[setNodes, setEdges, nodes, edges]
	);

	const contextMenuActions = useMemo(
		() => [
			{
				id: "copy",
				text: "Copy",
				onClick: () => copyNode(nodeContextMenuProps?.nodeId as string),
				icon: <MdCopyAll />,
			},
			{
				id: "delete",
				text: "Delete",
				onClick: () => deleteNode(nodeContextMenuProps?.nodeId as string),
				icon: <IoMdTrash />,
			},
		],
		[nodeContextMenuProps, copyNode, deleteNode]
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
				<Controls position="bottom-left" showInteractive={false} />
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
