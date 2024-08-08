import { ChangeEvent, useCallback, useState } from "react";
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	Button,
	FormControl,
	FormLabel,
	Input,
	Select,
	VStack,
	Textarea,
} from "@chakra-ui/react";

import type { InteractiveWorkflowStep } from "wdl";

import useWorkflowStore from "../../store";

type Props = {
	initInputs: InteractiveWorkflowStep["blocks"][number];
	onComplete: (newInputs: InteractiveWorkflowStep["blocks"][number]) => void;
};

const BlockEditor = (props: Props) => {
	const { isEditable } = useWorkflowStore();

	const { onComplete, initInputs } = props;

	const [blockInputs, setBlockInputs] = useState(initInputs);

	const onClose = useCallback(
		() => onComplete(blockInputs),
		[blockInputs, onComplete]
	);

	const onInputValueChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setBlockInputs((inps) => ({
			...inps,
			[event.target.name]: event.target.value,
		}));
	};

	const onBlockAttributeChange = (
		event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		if (blockInputs.type !== "input") return;

		setBlockInputs((inps) => ({
			...inps,
			attributes: {
				// @ts-expect-error No type definition right now
				...inps.attributes,
				[event.target.name]: event.target.value,
			},
		}));
	};

	return (
		<Modal isOpen onClose={onClose} isCentered size="xl">
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Edit Block</ModalHeader>
				<ModalCloseButton />

				<ModalBody py={0}>
					{blockInputs.type === "input" ? (
						<VStack gap="1rem">
							<FormControl>
								<FormLabel>Input Type</FormLabel>
								<Select
									value={blockInputs["attributes"]["type"] || "text"}
									onChange={onBlockAttributeChange}
									disabled={!isEditable}
									name="type"
								>
									{["text", "textarea", "number", "radio", "checkbox"].map(
										(type) => (
											<option value={type} key={type}>
												{type}
											</option>
										)
									)}
								</Select>
							</FormControl>
							<FormControl>
								<FormLabel>Input ID for reference in other places</FormLabel>
								<Input
									value={blockInputs["id"] || ""}
									onChange={onInputValueChange}
									name="id"
									disabled={!isEditable}
									placeholder="ID Of the Block to reference in other places"
								/>
							</FormControl>
							<FormControl>
								<FormLabel>Input Label</FormLabel>
								<Input
									value={blockInputs["attributes"]["label"] || ""}
									onChange={onBlockAttributeChange}
									name="label"
									disabled={!isEditable}
									placeholder="Ex: Evaluating User's Entered Input"
								/>
							</FormControl>
							<FormControl>
								<FormLabel>Input Placeholder</FormLabel>
								<Input
									value={blockInputs["attributes"]["placeholder"] || ""}
									onChange={onBlockAttributeChange}
									disabled={!isEditable}
									name="placeholder"
									placeholder="Ex: Evaluating your entered info"
								/>
							</FormControl>
						</VStack>
					) : (
						<FormControl>
							<FormLabel>Block Data</FormLabel>
							<Textarea
								value={blockInputs["data"] || ""}
								onChange={onInputValueChange}
								name="data"
								disabled={!isEditable}
								placeholder="Data associated with block"
							/>
						</FormControl>
					)}
				</ModalBody>

				<ModalFooter>
					<Button colorScheme="teal" onClick={onClose}>
						Done
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default BlockEditor;
