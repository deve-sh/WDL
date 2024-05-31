import { Fragment, useMemo } from "react";
import styled from "@emotion/styled";
import { Text, VStack, useToast } from "@chakra-ui/react";

import useAPIFlow from "../store";
import useDragAndDrop from "../hooks/use-drag-and-drop";

const DraggableComponentNode = styled.div`
	border: 0.125rem solid var(--chakra-colors-chakra-border-color);
	padding: 1rem;
	border-radius: 0.25rem;
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
			{ type: "send-request", label: "Send Request" },
			{ type: "if-condition", label: "If Condition" },
			{ type: "evaluate", label: "Evaluate Expression" },
			{ type: "delay", label: "Delay" },
		],
		[shouldHideStartBlockCreator]
	);

	return (
		<>
			<VStack gap="0.5rem" mt="4">
				<Text align="center" mb="4">
					Drag and Drop blocks onto the canvas
				</Text>
				{blocks.map((block) => {
					if (block.disabled) return null;
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
								draggable
							>
								{block.label}
							</DraggableComponentNode>
							<br />
						</Fragment>
					);
				})}
			</VStack>
		</>
	);
};

export default ComponentPanel;
