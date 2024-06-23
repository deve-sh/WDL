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
import IfElseBlockOptions from "./IfElseBlock";
import EvaluateBlockOptions from "./EvaluateBlock";
import ResolverBlockOptions from "./ResolverBlock";

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
					{node?.type === "if-else" && <IfElseBlockOptions />}
					{node?.type === "evaluate" && <EvaluateBlockOptions />}
					{node?.type === "resolver" && <ResolverBlockOptions />}
				</ModalBody>

				<ModalFooter>
					<Button variant="ghost" mr={3} onClick={onClose}>
						Close
					</Button>
					<Button colorScheme="teal" onClick={onClose}>
						Done
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default BlockDataEditor;
