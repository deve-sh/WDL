import { createStore } from "zustand/vanilla";
import { useStore } from "zustand";
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

type RFState = {
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
};

export const workflowStore = createStore<RFState>((set, get) => ({
	nodes: [],
	edges: [],
	loading: false,
	isDirty: false,
	isEditable: false,
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
}));

const useWorkflowStore = () => useStore(workflowStore);

export default useWorkflowStore;
