import { Box, Text, Tooltip } from "@chakra-ui/react";

import useCurrentNodeMetadata from "../hooks/use-current-node-metadata";

const BlockFace = ({ nodePrimaryLabel }: { nodePrimaryLabel: string }) => {
	const nodeMetadata = useCurrentNodeMetadata();

	return nodeMetadata?.name ? (
		<Box textAlign="center">
			<Tooltip label={nodeMetadata.name}>
				<div>
					<Text
						fontSize="md"
						maxWidth="250px"
						textOverflow="ellipsis"
						overflow="hidden"
						whiteSpace="nowrap"
					>
						{nodeMetadata.name}
					</Text>
				</div>
			</Tooltip>
			<Text fontSize="xs">({nodePrimaryLabel})</Text>
		</Box>
	) : (
		<Text>{nodePrimaryLabel}</Text>
	);
};

export default BlockFace;
