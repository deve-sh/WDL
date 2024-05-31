import { useEffect } from "react";

const useLayoutCorrection = () => {
	useEffect(() => {
		const setLayoutCorrectly = () => {
			const header = document.getElementsByTagName("header")[0];
			const editorContainer = document.getElementById(
				"editor-react-flow-container"
			);
			const editorSidebar = document.getElementById("editor-sidebar-wrapper");
			if (!header || !editorContainer || !editorSidebar) return;

			const totalHeight = window.innerHeight;
			const headerHeight = header.getBoundingClientRect().height;

			const remainingHeight = totalHeight - headerHeight;

			editorContainer.style.height = remainingHeight + "px";
			editorSidebar.style.height = remainingHeight + "px";
		};
		setLayoutCorrectly();
		window.addEventListener("resize", setLayoutCorrectly);
		return () => window.removeEventListener("resize", setLayoutCorrectly);
	}, []);
};

export default useLayoutCorrection;
