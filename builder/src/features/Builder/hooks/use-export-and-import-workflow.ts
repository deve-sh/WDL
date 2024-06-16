import { useCallback } from "react";
import useWorkflowStore from "../store";

const useExportAndImportWorkflow = () => {
	const { nodes, edges, setNodes, setEdges, setIsEditable } =
		useWorkflowStore();

	return {
		exportWorkflow: useCallback(() => {
			const data = JSON.stringify({ nodes, edges });
			const link = document.createElement("a");
			const fileLink = URL.createObjectURL(
				new Blob([data], { type: "application/json" })
			);
			link.href = fileLink;
			link.setAttribute("download", "Workflow Builder Export.json");
			document.body.appendChild(link);

			link.click();

			document.body.removeChild(link);

			setTimeout(() => {
				// Invalidate URL after 5 seconds of sync download
				URL.revokeObjectURL(fileLink);
			}, 5000);
		}, [edges, nodes]),
		importWorkflow: useCallback(
			async (file?: File) => {
				if (!file) return;

				try {
					const parsedFile = await file.text();
					const parsed = JSON.parse(parsedFile);
					const { nodes: parsedNodes, edges: parsedEdges } = parsed;
					setNodes(parsedNodes);
					setEdges(parsedEdges);
					setIsEditable(true);
				} catch (error) {
					return window.alert("Invalid workflow specified");
				}
			},
			[setNodes, setEdges, setIsEditable]
		),
	};
};

export default useExportAndImportWorkflow;
