import { type ChangeEvent } from "react";

import { VStack, Select, FormControl, FormLabel } from "@chakra-ui/react";

import useWorkflowStore from "../../store";

import CodeEditor from "../CodeEditor";
import useGetAndSetMetadata from "./use-get-and-set-block-metadata";
import CommonMetadataForm from "./CommonMetadataEditor";

const RequestBlockOptions = () => {
	const { isEditable } = useWorkflowStore();

	const [metadata, setMetadata] = useGetAndSetMetadata();

	const onURLChange = (url: string) => {
		setMetadata({ ...metadata, endpoint: url.replace(/\n/gi, "") });
	};

	const onMethodChange = (event: ChangeEvent<HTMLSelectElement>) => {
		setMetadata({ ...metadata, method: event.target.value });
	};

	const onBodyChange = (body: string) => {
		setMetadata({ ...metadata, body });
	};

	const onHeadersChange = (headers: string) => {
		setMetadata({ ...metadata, headers });
	};

	return (
		<VStack gap="1rem">
			<FormControl>
				<FormLabel>Request URL</FormLabel>
				<CodeEditor
					value={metadata["endpoint"] || ""}
					onChange={onURLChange}
					language="js"
					placeholder="{{ inputs.request.query.url }}"
					disabled={!isEditable}
				/>
			</FormControl>
			<FormControl>
				<FormLabel>Request Method</FormLabel>
				<Select
					value={metadata["method"] || "GET"}
					onChange={onMethodChange}
					disabled={!isEditable}
				>
					<option value="GET">GET</option>
					<option value="POST">POST</option>
					<option value="PUT">PUT</option>
					<option value="PATCH">PATCH</option>
					<option value="DELETE">DELETE</option>
				</Select>
			</FormControl>
			<FormControl>
				<FormLabel>Request Body</FormLabel>
				<CodeEditor
					value={metadata["body"] || ""}
					onChange={onBodyChange}
					language="json"
					placeholder='{ "a": 1, "b": 2 }'
					disabled={!isEditable}
				/>
			</FormControl>
			<FormControl>
				<FormLabel>Request Headers</FormLabel>
				<CodeEditor
					value={metadata["headers"] || ""}
					onChange={onHeadersChange}
					language="json"
					placeholder='{ "authorization": "Bearer {{ env.PRIVATE_TOKEN }}", "X-Entity-Id": 123 }'
					disabled={!isEditable}
				/>
			</FormControl>
			<CommonMetadataForm metadata={metadata} setMetadata={setMetadata} />
		</VStack>
	);
};

export default RequestBlockOptions;
