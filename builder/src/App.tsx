import { ChakraBaseProvider, theme } from "@chakra-ui/react";

import BuilderFeature from "./features/Builder";

function App() {
	return (
		<ChakraBaseProvider theme={theme}>
			<header id="header" />
			<BuilderFeature />
		</ChakraBaseProvider>
	);
}

export default App;
