import { ChakraBaseProvider } from "@chakra-ui/react";

import BuilderFeature from "./features/Builder";

function App() {
	return (
		<ChakraBaseProvider>
			<header id="header" />
			<BuilderFeature />
		</ChakraBaseProvider>
	);
}

export default App;
