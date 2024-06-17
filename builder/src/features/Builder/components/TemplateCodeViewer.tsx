import { Code, Flex, Text, Tooltip, useToast } from "@chakra-ui/react";
import styled from "@emotion/styled";
import { MdCode } from "react-icons/md";

// @ts-expect-error PrismJS's types somehow don't work here
import { highlight, languages } from "prismjs/components/prism-core";

import useCodeForWorkflow from "../hooks/use-code-for-workflow";

import "prismjs/components/prism-json";
import "prismjs/themes/prism.min.css";

const StyledCode = styled(Code)`
	padding: 1rem;
	border-radius: 0.25rem;
	max-width: 100%;
	max-height: 45vh;
	overflow: auto;
	cursor: pointer;
	white-space: pre;

	&::-webkit-scrollbar {
		display: none;
	}
`;

const CodeWrapper = styled.div`
	padding: 0;
	position: relative;
	width: 100%;
`;

const TemplateCodeViewer = () => {
	const toast = useToast();
	const template = useCodeForWorkflow();

	const copyToClipboard = async () => {
		try {
			await navigator.clipboard.writeText(template);
			toast({ status: "warning", title: "Copied to clipboard" });
		} catch {
			toast({ status: "error", title: "Failed to copy to clipboard" });
		}
	};

	const syntaxHighlightedCode = highlight(template, languages["json"]);

	return (
		<>
			<Flex justifyContent="center" alignItems="center" gap="3" mb="4">
				<MdCode size="1.25rem" />
				<Text fontSize="lg">Generated Workflow Template</Text>
			</Flex>
			<Tooltip label="Tap to copy template" placement="right">
				<CodeWrapper onClick={copyToClipboard}>
					<StyledCode
						dangerouslySetInnerHTML={{ __html: syntaxHighlightedCode }}
					/>
				</CodeWrapper>
			</Tooltip>
		</>
	);
};

export default TemplateCodeViewer;
