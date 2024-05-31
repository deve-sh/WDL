import styled from "@emotion/styled";
import { Divider } from "@chakra-ui/react";

// import EditableInput from "../../components/EditableInput";

import ComponentPanel from "./blocks/ComponentPanel";

const SidebarWrapper = styled.div`
	width: 20vw;
	border-right: 1px solid #efefef;
	padding: 1rem;
	overflow-y: auto;
`;

const EditorSidebar = () => {
	return (
		<SidebarWrapper id="editor-sidebar-wrapper">
			{/* {!!routeInfoResponse?.route?.name && (
				<EditableInput
					value={routeInfoResponse.route.name}
					onSubmit={updateRouteProperty("name")}
				>
					<Heading
						as="h3"
						size="lg"
						textOverflow="ellipsis"
						overflow="hidden"
						whiteSpace="nowrap"
						mb="4"
					>
						{routeInfoResponse.route.name}
					</Heading>
				</EditableInput>
			)} 
            <Skeleton width="100%" my="4" isLoaded={true}>
				<EditableInput
					as="textarea"
					value={routeInfoResponse?.route?.description || ""}
					onSubmit={updateRouteProperty("description")}
				>
					<Text whiteSpace="pre-wrap">
						{routeInfoResponse?.route?.description || "No description"}
					</Text>
				</EditableInput>
			</Skeleton>
			// {!!routeInfoResponse?.route?.routeSlug && (
			// 	<EditableInput
			// 		value={routeInfoResponse.route.routeSlug}
			// 		onSubmit={updateRouteProperty("routeSlug")}
			// 	>
			// 		<Tag>/{routeInfoResponse.route.routeSlug}</Tag>
			// 	</EditableInput>
            // )}
            */}
			<ComponentPanel />
			<Divider my="6" />
		</SidebarWrapper>
	);
};

export default EditorSidebar;
