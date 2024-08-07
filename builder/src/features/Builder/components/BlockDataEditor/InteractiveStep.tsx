import { VStack } from "@chakra-ui/react";

import useGetAndSetMetadata from "./use-get-and-set-block-metadata";

import CommonMetadataForm from "./CommonMetadataEditor";

const InteractiveStepOptions = () => {
	const [metadata, setMetadata] = useGetAndSetMetadata();

	return (
		<VStack gap="1rem">
			<CommonMetadataForm metadata={metadata} setMetadata={setMetadata} />
		</VStack>
	);
};

export default InteractiveStepOptions;
