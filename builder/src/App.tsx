import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ChakraBaseProvider, theme } from "@chakra-ui/react";

import Home from "./features/Home";
import BuilderFeature from "./features/Builder";

import './common-styles.css';

function App() {
	return (
		<ChakraBaseProvider theme={theme}>
			<BrowserRouter>
				<Routes>
					<Route path="/" Component={Home} />
					<Route path="/builder" Component={BuilderFeature} />
				</Routes>
			</BrowserRouter>
		</ChakraBaseProvider>
	);
}

export default App;
