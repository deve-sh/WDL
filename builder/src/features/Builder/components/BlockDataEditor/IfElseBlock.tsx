import { VStack, FormControl, FormLabel } from "@chakra-ui/react";

import useWorkflowStore from "../../store";
import useGetAndSetMetadata from "./use-get-and-set-block-metadata";

import CodeEditor from "../../../../components/CodeEditor";
import CommonMetadataForm from "./CommonMetadataEditor";

const ConditionalBlockOptions = () => {
	const { isEditable } = useWorkflowStore();

	const [metadata, setMetadata] = useGetAndSetMetadata();

	const onExpressionChange = (code: string) => {
		setMetadata({ condition: code });
	};

	return (
		<VStack gap="1rem">
			<FormControl mb="2">
				<FormLabel>Conditional expression</FormLabel>
				<CodeEditor
					placeholder="steps.enterOTPStep.inputs.otp !== ''"
					value={metadata["condition"] || ""}
					onChange={onExpressionChange}
					language="js"
					disabled={!isEditable}
				/>
			</FormControl>
			<CommonMetadataForm metadata={metadata} setMetadata={setMetadata} />
		</VStack>
	);
};

export default ConditionalBlockOptions;
