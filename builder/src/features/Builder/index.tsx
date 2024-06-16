import { Flex, Skeleton } from "@chakra-ui/react";

import useLayoutCorrection from "./hooks/use-layout-correction";

import Builder from "./Builder";
import EditorSidebar from "./components/Sidebar";

export default function BuilderFeature() {
	useLayoutCorrection();

	return (
		<>
			<Flex alignItems="center" justifyContent="center">
				<EditorSidebar />
				<div
					id="editor-react-flow-container"
					style={{ width: "80%", height: "100vh" }}
				>
					<Skeleton height="100%" width="100%" isLoaded={true}>
						<Builder />
					</Skeleton>
				</div>
				{/* <SaveButton onSaveClick={saveAPIRoute} /> */}
			</Flex>
		</>
	);
}
