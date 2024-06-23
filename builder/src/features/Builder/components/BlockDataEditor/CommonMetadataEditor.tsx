import { type ChangeEvent } from "react";
import { type Node } from "reactflow";

import {
	Divider,
	FormControl,
	FormLabel,
	Input,
	Textarea,
} from "@chakra-ui/react";

import useWorkflowStore from "../../store";

const CommonMetadataForm = ({
	metadata,
	setMetadata,
}: {
	metadata: Node["data"];
	setMetadata: (data: typeof metadata) => void;
}) => {
	const { isEditable } = useWorkflowStore();
	const onMetadataChange = (
		event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setMetadata({ ...metadata, [event.target.name]: event.target.value });
	};

	return (
		<>
			<Divider />
			<FormControl>
				<FormLabel>Step ID</FormLabel>
				<Input
					value={metadata["userEnteredId"] || ""}
					onChange={onMetadataChange}
					name="userEnteredId"
					disabled={!isEditable}
					placeholder="ID Of the Step to reference in other places"
				/>
			</FormControl>
			<FormControl>
				<FormLabel>Step Name</FormLabel>
				<Input
					value={metadata["name"] || ""}
					onChange={onMetadataChange}
					name="name"
					disabled={!isEditable}
					placeholder="Ex: Evaluating User's Entered Input"
				/>
			</FormControl>
			<FormControl>
				<FormLabel>Heading to be shown to user</FormLabel>
				<Input
					value={metadata["heading"] || ""}
					onChange={onMetadataChange}
					disabled={!isEditable}
					name="heading"
					placeholder="Ex: Evaluating your entered info"
				/>
			</FormControl>
			<FormControl>
				<FormLabel>Other text to be shown to user</FormLabel>
				<Textarea
					value={metadata["description"] || ""}
					onChange={onMetadataChange}
					disabled={!isEditable}
					name="description"
					placeholder="Ex: Please wait while we take a look at your data and proceed"
				/>
			</FormControl>
		</>
	);
};

export default CommonMetadataForm;
