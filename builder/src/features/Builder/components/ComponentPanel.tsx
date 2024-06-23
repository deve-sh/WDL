import { Fragment, useMemo } from "react";
import styled from "@emotion/styled";
import { Text, VStack, useToast } from "@chakra-ui/react";

import useAPIFlow from "../store";
import useDragAndDrop from "../hooks/use-drag-and-drop";

const DraggableComponentNode = styled.div<{ draggable: boolean }>`
	border: 0.125rem solid var(--chakra-colors-chakra-border-color);
	padding: 1rem;
	border-radius: 0.25rem;
	background: ${({ draggable }) =>
		!draggable ? "var(--chakra-colors-chakra-border-color)" : ""};
	opacity: ${({ draggable }) => (!draggable ? "0.5" : "")};
	width: 100%;
	text-align: center;
	cursor: grab;
`;

const ComponentPanel = () => {
	const { nodes } = useAPIFlow();
	const toast = useToast();

	const { onDragStart } = useDragAndDrop();

	const shouldHideStartBlockCreator = useMemo(
		() => nodes.some((node) => node.type === "start"),
		[nodes]
	);

	const blocks = useMemo(
		() => [
			{ type: "start", label: "Start", disabled: shouldHideStartBlockCreator },
			{ type: "interactive-input", label: "Interactive User Inputs" },
			{ type: "request", label: "Make A Request" },
			{ type: "resolver", label: "Resolver / Manual Step" },
			{ type: "evaluate", label: "Evaluate Expression" },
			{ type: "if-else", label: "Conditional Expression" },
		],
		[shouldHideStartBlockCreator]
	);

	return (
		<VStack gap="0.5rem" mt="4">
			<Text align="center" mb="4">
				Drag and Drop blocks onto the canvas
			</Text>
			{blocks.map((block, index) => {
				return (
					<Fragment key={block.type}>
						<DraggableComponentNode
							onClick={() =>
								toast({
									title: "You can drag and drop this block onto the canvas",
									status: "info",
									isClosable: true,
								})
							}
							// @ts-expect-error Works but React Flow doesn't expose a type
							onDragStart={onDragStart(block.type)}
							draggable={!block.disabled}
						>
							{block.label}
						</DraggableComponentNode>
						{index !== blocks.length - 1 && <br />}
					</Fragment>
				);
			})}
		</VStack>
	);
};

export default ComponentPanel;
