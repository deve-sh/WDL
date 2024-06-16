import { Divider } from "@chakra-ui/react";

import styled from "@emotion/styled";

import ComponentPanel from "./ComponentPanel";
import ExportAndImport from "./ExportAndImport";
import TemplateCodeViewer from "./TemplateCodeViewer";

const SidebarWrapper = styled.div`
	width: 20vw;
	border-right: 1px solid #efefef;
	padding: 1rem;
	overflow-y: auto;
`;

const EditorSidebar = () => {
	return (
		<SidebarWrapper id="editor-sidebar-wrapper">
			<ExportAndImport />
			<Divider my="6" />
			<ComponentPanel />
			<Divider my="6" />
			<TemplateCodeViewer />
		</SidebarWrapper>
	);
};

export default EditorSidebar;
