import { VStack, FormControl, FormLabel } from "@chakra-ui/react";

import useWorkflowStore from "../../store";
import useGetAndSetMetadata from "./use-get-and-set-block-metadata";

import CodeEditor from "../CodeEditor";
import CommonMetadataForm from "./CommonMetadataEditor";

const EvaluateBlockOptions = () => {
	const { isEditable } = useWorkflowStore();

	const [metadata, setMetadata] = useGetAndSetMetadata();

	const onExpressionChange = (code: string) => {
		setMetadata({ ...metadata, expression: code });
	};

	return (
		<VStack gap="1rem">
			<FormControl>
				<FormLabel>Expression to evaluate</FormLabel>
				<CodeEditor
					placeholder={`return steps.enterOTPStep.inputs.otp || '';`}
					value={metadata["expression"] || ""}
					onChange={onExpressionChange}
					language="js"
					disabled={!isEditable}
				/>
			</FormControl>
			<CommonMetadataForm metadata={metadata} setMetadata={setMetadata} />
		</VStack>
	);
};

export default EvaluateBlockOptions;
