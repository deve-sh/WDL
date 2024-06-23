import { VStack } from "@chakra-ui/react";

import CommonMetadataForm from "./CommonMetadataEditor";

import useGetAndSetMetadata from "./use-get-and-set-block-metadata";

const ResolverBlockOptions = () => {
	const [metadata, setMetadata] = useGetAndSetMetadata();

	return (
		<VStack gap="1rem">
			<CommonMetadataForm metadata={metadata} setMetadata={setMetadata} />
		</VStack>
	);
};

export default ResolverBlockOptions;
