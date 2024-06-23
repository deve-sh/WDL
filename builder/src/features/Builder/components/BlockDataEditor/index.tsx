import { useCallback, useMemo } from "react";
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	Button,
} from "@chakra-ui/react";

import useWorkflowStore from "../../store";

import RequestBlockOptions from "./RequestBlock";
import ConditionalBlockOptions from "./ConditionalBlock";
import EvaluateBlockOptions from "./EvaluateBlock";

const BlockDataEditor = () => {
	const { nodes, editingMetadataFor, setEditingMetadataFor } =
		useWorkflowStore();

	const node = useMemo(() => {
		return nodes.find((node) => node.id === editingMetadataFor);
	}, [nodes, editingMetadataFor]);

	const onClose = useCallback(() => {
		setEditingMetadataFor(null);
	}, []);

	return (
		<Modal isOpen onClose={onClose} isCentered size="xl">
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Edit Workflow Block</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					{node?.type === "request" && <RequestBlockOptions />}
					{node?.type === "if-else" && <ConditionalBlockOptions />}
                    {node?.type === "evaluate" && <EvaluateBlockOptions />}
				</ModalBody>

				<ModalFooter>
					<Button variant="ghost" mr={3} onClick={onClose}>
						Close
					</Button>
					<Button colorScheme="teal">Done</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default BlockDataEditor;
