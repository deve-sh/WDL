import { useEffect, useMemo, useState } from "react";
import useWorkflowStore from "../../store";

const useGetAndSetMetadata = () => {
	const { editingMetadataFor, nodes, setNodes } = useWorkflowStore();

	// Getting initial metadata to start with
	// so we don't update the store on every change
	// preventing excessing re-rendering of the entire editor
	const metadataToStartWith = useMemo(() => {
		return nodes.find((node) => node.id === editingMetadataFor)?.data;
	}, []);

	const [metadata, setMetadata] = useState(metadataToStartWith);

	useEffect(() => {
		// Update metadata for block on unmounting
		return () => {
			const updatedNodes = nodes.map((node) =>
				node.id !== editingMetadataFor ? node : { ...node, data: metadata }
			);
			setNodes(updatedNodes);
		};
	}, []);

	return [metadata, setMetadata];
};

export default useGetAndSetMetadata;
