import React, { MouseEvent, useCallback, useState } from "react";
import { MdAdd } from "react-icons/md";
import { Handle, Position } from "reactflow";
import {
	Divider,
	Flex,
	IconButton,
	Select,
	Tag,
	TagCloseButton,
	TagLabel,
	TagLeftIcon,
	VStack,
} from "@chakra-ui/react";

import { v4 } from "uuid";

import type { InteractiveWorkflowStep } from "wdl";

import CommonNodeWrapper from "./CommonNodeWrapper";
import BlockFace from "./BlockFace";

import useWorkflowStore from "../store";
import useCurrentNodeMetadata from "../hooks/use-current-node-metadata";

const baseActionObject = {
	id: "",
	attributes: {
		primary: false,
	},
	validations: [],
	onValidationSuccess: { targetStep: null },
	onValidationError: { targetStep: null },
};

const baseInputObject = {
	type: "input",
	attributes: {
		type: "text",
		placeholder: "",
		label: "",
	},
	id: "",
};

type WorkflowStepRepresentationBlockType =
	InteractiveWorkflowStep["blocks"][number]["type"];
const blockTypes: WorkflowStepRepresentationBlockType[] = [
	"input",
	"text",
	"heading",
	"image",
	"line-break",
	"misc",
];

const InteractiveInputStep = React.memo(() => {
	const { edges, setEdges } = useWorkflowStore();
	const [nodeMetadata, setNodeMetadata] = useCurrentNodeMetadata();

	const [activeNewBlockType, setActiveNewBlockType] =
		useState<WorkflowStepRepresentationBlockType>(blockTypes[0]);

	const onAddNewBlockToStep = useCallback(
		(
			event: MouseEvent<HTMLSpanElement>,
			type: WorkflowStepRepresentationBlockType
		) => {
			event.stopPropagation();

			let nodeObject;

			if (type === "input") nodeObject = baseInputObject;
			else nodeObject = { type, data: "" };

			setNodeMetadata({
				...nodeMetadata,
				blocks: [...(nodeMetadata.blocks || []), nodeObject],
			});
		},
		[setNodeMetadata, nodeMetadata]
	);

	const onRemoveBlockFromStep = useCallback(
		(index: number) => {
			const newBlocks = [...nodeMetadata.blocks];
			newBlocks.splice(index, 1);
			setNodeMetadata({ ...nodeMetadata, blocks: newBlocks });
		},
		[setNodeMetadata, nodeMetadata]
	);

	const onAddNewActionToStep = useCallback(
		(event: MouseEvent<HTMLSpanElement>) => {
			event.stopPropagation();

			setNodeMetadata({
				...nodeMetadata,
				actions: [
					...(nodeMetadata.actions || []),
					{ ...baseActionObject, internalId: v4() },
				],
			});
		},
		[setNodeMetadata, nodeMetadata]
	);

	const onRemoveActionFromStep = useCallback(
		(index: number) => {
			const actionToRemove = nodeMetadata.actions[index];
			const newActions = [...nodeMetadata.actions];

			newActions.splice(index, 1);

			const filteredEdges = edges.filter(
				(edge) => edge.sourceHandle !== actionToRemove.internalId
			);

			setNodeMetadata({ ...nodeMetadata, actions: newActions });
			setEdges(filteredEdges);
		},
		[setNodeMetadata, nodeMetadata, setEdges, edges]
	);

	return (
		<CommonNodeWrapper>
			<Handle type="target" position={Position.Top} />

			<BlockFace nodePrimaryLabel="Interactive Step" />

			<VStack gap="2" mt="2">
				{!!nodeMetadata.blocks?.length &&
					nodeMetadata.blocks.map((block: { type: string }, index: number) => (
						<Tag key={index} variant="outline">
							<TagLabel textTransform="capitalize">{block.type} Block</TagLabel>
							<TagCloseButton
								onClick={(e) => {
									e.stopPropagation();
									onRemoveBlockFromStep(index);
								}}
							/>
						</Tag>
					))}

				<Flex
					gap="0.5rem"
					alignItems="center"
					onClick={(e) => e.stopPropagation()}
				>
					<Select
						onChange={(e) =>
							setActiveNewBlockType(
								e.target.value as WorkflowStepRepresentationBlockType
							)
						}
						value={activeNewBlockType}
						size="xs"
						variant="outline"
						borderRadius="4"
					>
						{blockTypes.map((type) => (
							<option key={type} value={type}>
								{type}
							</option>
						))}
					</Select>
					<IconButton
						aria-label="Add New Block"
						size="xs"
						variant="outline"
						onClick={(e) => onAddNewBlockToStep(e, activeNewBlockType)}
					>
						<MdAdd />
					</IconButton>
				</Flex>
			</VStack>

			<Divider my={4} />

			<VStack gap="2" mt="2">
				{!!nodeMetadata.actions?.length &&
					nodeMetadata.actions.map(
						(action: { internalId: string }, index: number) => (
							<Tag variant="outline">
								<TagLabel>Action Button</TagLabel>

								<TagCloseButton
									onClick={(e) => {
										e.stopPropagation();
										onRemoveActionFromStep(index);
									}}
								/>
								<Handle
									type="source"
									id={action.internalId}
									position={Position.Right}
								/>
							</Tag>
						)
					)}

				<Tag onClick={onAddNewActionToStep} width="100%" mt="2">
					<TagLeftIcon as={MdAdd} />
					<TagLabel>New Action</TagLabel>
				</Tag>
			</VStack>
		</CommonNodeWrapper>
	);
});

export default InteractiveInputStep;
