import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useWorkflowStore from "../../store";

const useGetAndSetMetadata = () => {
	const { editingMetadataFor, nodes, setNodes } = useWorkflowStore();

	// Getting initial metadata to start with
	// so we don't update the store on every change
	// preventing excessing re-rendering of the entire editor
	const metadataToStartWith = useMemo(() => {
		return nodes.find((node) => node.id === editingMetadataFor)?.data || {};
	}, []);

	const _metadata = useRef(metadataToStartWith);
	const [metadata, setMetadata] = useState(metadataToStartWith);

	const updateMetadata = useCallback((updates: typeof metadata) => {
		_metadata.current = updates;
		setMetadata(updates);
	}, []);

	useEffect(() => {
		// Update metadata for block on unmounting
		return () => {
			const updatedNodes = nodes.map((node) =>
				node.id !== editingMetadataFor
					? node
					: { ...node, data: _metadata.current }
			);
			setNodes(updatedNodes);
		};
	}, []);

	return [metadata, updateMetadata];
};

export default useGetAndSetMetadata;
