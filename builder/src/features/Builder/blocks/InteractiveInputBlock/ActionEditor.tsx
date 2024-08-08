import { ChangeEvent, useCallback, useState } from "react";
import { type InteractiveWorkflowStep } from "wdl";

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
	VStack,
	Divider,
    Box,
} from "@chakra-ui/react";

import useWorkflowStore from "../../store";
import CodeEditor from "../../components/CodeEditor";

type Props = {
	initInputs: InteractiveWorkflowStep["actions"][number];
	onComplete: (newInputs: InteractiveWorkflowStep["actions"][number]) => void;
};

const ActionEditor = (props: Props) => {
	const { isEditable } = useWorkflowStore();

	const { onComplete, initInputs } = props;

	const [actionInputs, setActionInputs] = useState(initInputs);
	const [validationCode, setValidationCode] = useState(
		initInputs.validations?.[0]?.condition || ""
	);
	const [validationError, setValidationError] = useState(
		initInputs.validations?.[0]?.errorMessage || ""
	);

	const onClose = useCallback(
		() =>
			onComplete({
				...actionInputs,
				validations: [
					{ condition: validationCode, errorMessage: validationError },
				],
			}),
		[actionInputs, validationCode, validationError, onComplete]
	);

	const onActionValueChange = (
		event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setActionInputs((inps) => ({
			...inps,
			[event.target.name]: event.target.value,
		}));
	};

	const onActionAttributeChange = (
		event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		// @ts-expect-error No type definition match right now
		setActionInputs((inps) => ({
			...inps,
			attributes: {
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
					<VStack gap="1rem">
						<FormControl>
							<FormLabel>Action ID for reference in other places</FormLabel>
							<Input
								value={actionInputs["id"] || ""}
								onChange={onActionValueChange}
								name="id"
								disabled={!isEditable}
								placeholder="ID Of the Action to reference in other places"
							/>
						</FormControl>
						<FormControl>
							<FormLabel>Button Label</FormLabel>
							<Input
								value={actionInputs["attributes"]?.["label"] || ""}
								onChange={onActionAttributeChange}
								name="label"
								disabled={!isEditable}
								placeholder="Ex: Submit"
							/>
						</FormControl>
						<Divider />
						<Box width="100%">
							<FormLabel>Validation Code</FormLabel>
							<CodeEditor
								onChange={setValidationCode}
								value={validationCode}
								disabled={!isEditable}
								language="js"
								placeholder="Any condition you want to run when the user clicks on Action Button"
							/>
						</Box>
						<FormControl>
							<FormLabel>Error Message On Validation</FormLabel>
							<Input
								value={validationError || ""}
								onChange={(e) => {
									e.persist();
									setValidationError(e.target.value);
								}}
								disabled={!isEditable}
								placeholder="Ex: Phone number is not valid"
							/>
						</FormControl>
					</VStack>
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

export default ActionEditor;
