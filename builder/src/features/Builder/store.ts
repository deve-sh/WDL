import { useStore } from "zustand";
import { createStore } from "zustand/vanilla";
import { persist } from "zustand/middleware";

import {
	Connection,
	Edge,
	EdgeChange,
	Node,
	NodeChange,
	addEdge,
	OnNodesChange,
	OnEdgesChange,
	OnConnect,
	applyNodeChanges,
	applyEdgeChanges,
} from "reactflow";

type WorkflowBuilderState = {
	nodes: Node[];
	edges: Edge[];
	loading: boolean;
	onNodesChange: OnNodesChange;
	onEdgesChange: OnEdgesChange;
	onConnect: OnConnect;
	setLoading: (loading: boolean) => void;
	setNodes: (nodes: Node[]) => void;
	setEdges: (edges: Edge[]) => void;
	isDirty: boolean;
	setIsDirty: (isDirty: boolean) => void;
	isEditable: boolean;
	setIsEditable: (isEditable: boolean) => void;
	editingMetadataFor: string | null;
	setEditingMetadataFor: (nodeId: string | null) => void;
};

export const workflowStore = createStore(
	persist<WorkflowBuilderState>(
		(set, get) => ({
			nodes: [],
			edges: [],
			loading: false,
			isDirty: false,
			isEditable: true,
			editingMetadataFor: "",
			onNodesChange: (changes: NodeChange[]) => {
				set({
					nodes: applyNodeChanges(changes, get().nodes),
					isDirty: true,
				});
			},
			onEdgesChange: (changes: EdgeChange[]) => {
				set({
					edges: applyEdgeChanges(changes, get().edges),
					isDirty: true,
				});
			},
			onConnect: (connection: Connection) => {
				if (connection.source === connection.target) return;

				const sourceNode = get().nodes.find(
					(node) => node.id === connection.source
				);

				if (!sourceNode) return;

				if (sourceNode.type !== "resolver") {
					// A resolver type can plug into as many nodes as it wants as there's no defined flow of use.

					const existingEdgeFromHandle = get().edges.find(
						(edge) =>
							edge.source === connection.source &&
							edge.sourceHandle === connection.sourceHandle
					);

					if (existingEdgeFromHandle) return;
				}

				set({
					edges: addEdge(
						{ ...connection, animated: true, type: "smoothstep" },
						get().edges
					),
				});
			},
			setLoading: (loading) => set({ loading }),
			setNodes: (nodes) => set({ nodes }),
			setEdges: (edges) => set({ edges }),
			setIsDirty: (isDirty) => {
				if (get().isEditable) set({ isDirty });
			},
			setIsEditable: (isEditable) => set({ isEditable }),
			setEditingMetadataFor: (nodeId) => set({ editingMetadataFor: nodeId }),
		}),
		{
			name: "workflow-builder-core-store-persistor-layer",
			partialize: (state) =>
				({
					nodes: state.nodes,
					edges: state.edges,
					isEditable: state.isEditable,
				} as WorkflowBuilderState),
		}
	)
);

const useWorkflowStore = () => useStore(workflowStore);

export default useWorkflowStore;
