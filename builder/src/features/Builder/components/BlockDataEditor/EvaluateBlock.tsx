import { VStack, FormControl, FormLabel } from "@chakra-ui/react";

import useWorkflowStore from "../../store";

import CodeEditor from "../../../../components/CodeEditor";

import useGetAndSetMetadata from "./use-get-and-set-block-metadata";

const EvaluateBlockOptions = () => {
	const { isEditable } = useWorkflowStore();

	const [metadata, setMetadata] = useGetAndSetMetadata();

	const onChange = (code: string) => {
		setMetadata({ expression: code });
	};

	return (
		<VStack gap="1rem" marginBottom="5">
			<FormControl>
				<FormLabel>Expression to evaluate</FormLabel>
				<CodeEditor
					placeholder={`return steps.enterOTPStep.inputs.otp || '';`}
					value={metadata["expression"] || ""}
					onChange={onChange}
					language="js"
					disabled={!isEditable}
				/>
			</FormControl>
		</VStack>
	);
};

export default EvaluateBlockOptions;
