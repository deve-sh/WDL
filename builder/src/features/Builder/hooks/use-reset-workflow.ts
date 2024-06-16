import { useCallback } from "react";

import useWorkflowStore from "../store";

const useResetWorkflow = () => {
	const {
		nodes,
		edges,
		isEditable,
		setNodes,
		setEdges,
		setIsEditable,
		setIsDirty,
	} = useWorkflowStore();

	return {
		resetWorkflow: useCallback(() => {
			if (!window.confirm("Are you sure? This will reset all your progress"))
				return;

			setNodes([]);
			setEdges([]);
			setIsEditable(true);
			setIsDirty(false);
		}, [setEdges, setIsDirty, setIsEditable, setNodes]),
		isResettable: !!((nodes.length || edges.length) && isEditable),
	};
};

export default useResetWorkflow;
