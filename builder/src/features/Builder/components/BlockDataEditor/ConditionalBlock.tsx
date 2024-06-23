import { VStack, FormControl, FormLabel } from "@chakra-ui/react";

import useWorkflowStore from "../../store";

import CodeEditor from "../../../../components/CodeEditor";

import useGetAndSetMetadata from "./useGetAndSetBlockMetadata";

const ConditionalBlockOptions = () => {
	const { isEditable } = useWorkflowStore();

	const [metadata, setMetadata] = useGetAndSetMetadata();

	const onChange = (code: string) => {
		setMetadata({ expression: code });
	};

	return (
		<VStack gap="1rem" marginBottom="5">
			<FormControl>
				<FormLabel>Conditional expression</FormLabel>
				<CodeEditor
					placeholder="steps.enterOTPStep.inputs.otp !== ''"
					value={metadata["expression"] || ""}
					onChange={onChange}
					language="js"
					disabled={!isEditable}
				/>
			</FormControl>
		</VStack>
	);
};

export default ConditionalBlockOptions;
