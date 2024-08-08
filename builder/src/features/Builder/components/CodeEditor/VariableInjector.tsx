import { useMemo, useState } from "react";
import type { InteractiveWorkflowStep } from "wdl";

import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	Button,
	Box,
	Text,
	Flex,
	Tag,
	IconButton,
	Tooltip,
	VStack,
	TagLeftIcon,
	TagLabel,
} from "@chakra-ui/react";

import { BiInjection } from "react-icons/bi";
import { FaCodeBranch, FaRegKeyboard } from "react-icons/fa";
import { MdHttp } from "react-icons/md";
import { LuFunctionSquare } from "react-icons/lu";

import useWorkflowStore from "../../store";
import nodeTypes from "../../blocks/node-types";

const nodeTypesPropertyMap: Record<
	Exclude<keyof typeof nodeTypes, "start" | "resolver">,
	{ tagColor: string; icon: React.ReactElement }
> = {
	"interactive-input": {
		tagColor: "green",
		icon: <FaRegKeyboard size="1.5rem" />,
	},
	"if-else": { tagColor: "orange", icon: <FaCodeBranch size="1.5rem" /> },
	request: { tagColor: "teal", icon: <MdHttp size="1.5rem" /> },
	evaluate: { tagColor: "red", icon: <LuFunctionSquare size="1.5rem" /> },
};

const VariableInjector = ({
	value,
	onChange,
}: {
	value: string;
	onChange: (val: string) => void;
}) => {
	const [showInjector, setShowInjector] = useState(false);

	const { nodes } = useWorkflowStore();

	const injectableBits = useMemo(() => {
		const bits: {
			expression: string;
			type?: Exclude<keyof typeof nodeTypes, "start" | "resolver">;
			description: string;
		}[] = [];

		bits.push({
			expression: `steps.<stepId>.`,
			description: "Get anything from any step's metadata",
		});

		for (const node of nodes) {
			const nodeId = (
				node.data?.userEnteredId ||
				node.data?.id ||
				node.id
			).replace("-", "_");

			if (node.type === "interactive-input") {
				if (node.data && node.data.blocks && node.data.blocks.length) {
					const inputs = node.data.blocks.filter(
						(block: InteractiveWorkflowStep["blocks"][number]) =>
							block.type === "input"
					);

					for (const input of inputs) {
						const inputResultExpression = `steps.${nodeId}.inputs.${input.id}`;
						bits.push({
							expression: inputResultExpression,
							description: "Get input value of a step",
							type: node.type || "",
						});
					}
				}

				if (node.data && node.data.actions && node.data.actions.length)
					bits.push({
						expression: `steps.${nodeId}.validationErrors`,
						description: "Get validation errors for step's actions",
						type: node.type || "",
					});
			}

			if (node.type === "request") {
				bits.push({
					expression: `steps.${nodeId}.failed`,
					description: "Get boolean if request failed",
					type: node.type || "",
				});

				bits.push({
					expression: `steps.${nodeId}.errorMessage`,
					description: "Get error message from request",
					type: node.type || "",
				});

				bits.push({
					expression: `steps.${nodeId}.response.<insert>`,
					description: "Get any field from the request's response",
					type: node.type || "",
				});
			}

			if (node.type === "evaluate") {
				bits.push({
					expression: `steps.${nodeId}.result`,
					description: "Get result of evaluation expression",
					type: node.type || "",
				});
			}

			if (node.type === "if-else") {
				bits.push({
					expression: `steps.${nodeId}.result`,
					description: "Get boolean result of conditional expression",
					type: node.type || "",
				});
			}
		}

		return bits;
	}, [nodes]);

	const onClose = () => setShowInjector(false);

	return (
		<>
			<Tooltip label="Inject Expressions from steps">
				<IconButton
					aria-label="Inject Expression"
					colorScheme="orange"
					onClick={() => setShowInjector(true)}
					position="absolute"
					size="sm"
					top="50%"
					right="0.25rem"
					transform="translateY(-50%)"
					zIndex="1001"
				>
					<BiInjection />
				</IconButton>
			</Tooltip>
			<Modal isOpen={showInjector} size="4xl" onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Inject An Expression</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<VStack gap="4">
							{injectableBits.map((bit) => (
								<Box
									border="2px solid #efefef"
									p="4"
									w="100%"
									borderRadius="5px"
									cursor="pointer"
									_hover={{ background: "#fafafa", borderColor: "teal" }}
									onClick={() => {
										onChange(
											`${value}${value.length ? " " : ""}{{${bit.expression}}}`
										);
										onClose();
									}}
								>
									<Flex alignItems="center" gap="3">
										{!!bit.type && (
											<Tag
												textTransform="capitalize"
												size="md"
												colorScheme={nodeTypesPropertyMap[bit.type].tagColor}
											>
												<TagLeftIcon>
													{nodeTypesPropertyMap[bit.type].icon}
												</TagLeftIcon>
												<TagLabel>{bit.type}</TagLabel>
											</Tag>
										)}
										<Text fontSize="md" color="blackAlpha.900" fontWeight="500">
											{bit.expression}
										</Text>
									</Flex>
									<Text color="gray" mt="2" fontSize="sm">
										{bit.description}
									</Text>
								</Box>
							))}
						</VStack>
					</ModalBody>

					<ModalFooter>
						<Button colorScheme="teal" onClick={onClose}>
							Done
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default VariableInjector;
