// Code editor component for things like body, headers and if-else condition editing
import Editor from "react-simple-code-editor";
import styled from "@emotion/styled";

import VariableInjector from "./VariableInjector";

// @ts-expect-error PrismJS's types somehow don't work here
import Prism, { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-json";
import "prismjs/themes/prism.min.css";

// For simple variable highlighting
Prism.languages.json = {
	"handlebar-variable": { pattern: /{{[{]?(.*?)[}]?}}/ },
	...Prism.languages.json,
};
Prism.languages.js = {
	"handlebar-variable": { pattern: /{{[{]?(.*?)[}]?}}/ },
	...Prism.languages.js,
};

interface Props {
	onChange: (value: string) => void;
	value: string;
	language: "json" | "js";
	placeholder?: string;
	disabled?: boolean;
	multiLine?: boolean;
}

const StyledEditor = styled(Editor)`
	border: 0.0125rem solid #e2e8f0;
	border-radius: 0.25rem;
	.token.handlebar-variable {
		color: var(--chakra-colors-purple-700);
		font-weight: 700;
	}
`;

const CodeEditor = (props: Props) => (
	<div style={{ position: "relative" }}>
		<StyledEditor
			value={props.value}
			onValueChange={!props.disabled ? props.onChange : () => null}
			highlight={(code) => highlight(code, languages[props.language])}
			padding={10}
			placeholder={props.placeholder}
			style={{
				fontFamily: '"Fira code", "Fira Mono", monospace',
				fontSize: 12,
			}}
		/>
		<VariableInjector value={props.value} onChange={props.onChange} />
	</div>
);

export default CodeEditor;
