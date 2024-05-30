import { useEffect } from "react";
import initWorkflow from "./workflows";

function App() {
	useEffect(() => {
		initWorkflow()
	}, [])
	return <></>;
}

export default App;
