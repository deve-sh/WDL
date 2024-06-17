import {
	Box,
	Button,
	ButtonGroup,
	Code,
	Divider,
	Flex,
	Heading,
	Image,
	Link,
	Text,
	VStack,
} from "@chakra-ui/react";

import { IoBuild } from "react-icons/io5";
import { ImNpm } from "react-icons/im";

import LoomVideo from "./LoomVideo";

import {
	getInstallationCodeSnippet,
	getUsageCodeSnippet,
} from "./codeSnippets";

const Home = () => (
	<>
		<Box bg="teal.500" h="10" borderRadius="100%" marginTop="-20px" />
		<Box id="hero-section" maxW="1100px" p="4" w="100%" m="0 auto">
			<VStack pt="16" pb="6" justifyContent="center">
				<Image src="/icon-large.png" boxSize={{ lg: "175px", base: "100px" }} />
				<Heading fontSize="5xl">WDL</Heading>
				<Text
					fontSize="xl"
					color="gray.500"
					textAlign="center"
					lineHeight="2rem"
					maxWidth="500px"
				>
					A simple yet extensible + scalable state-machine based framework for
					full-stack workflows.
				</Text>
				<ButtonGroup mt="6">
					<Button
						colorScheme="teal"
						p={{ lg: "8", base: "4" }}
						size="lg"
						variant="solid"
						leftIcon={<IoBuild />}
					>
						Try The Builder
					</Button>
					<Button
						size="lg"
						p={{ lg: "8", base: "4" }}
						colorScheme="red"
                        variant="outline"
						leftIcon={<ImNpm />}
					>
						<Link
							href="https://npmjs.com/wdl"
							target="_blank"
							rel="noopener noreferrer"
						>
							Get Started
						</Link>
					</Button>
				</ButtonGroup>
				<VStack gap="4" w="100%" mt="8">
					<Code
						w={{ lg: "75%", md: "75%", base: "100%" }}
						overflow="auto"
						p="4"
						borderRadius="10px"
						whiteSpace="pre"
						dangerouslySetInnerHTML={{ __html: getInstallationCodeSnippet() }}
					/>
					<Code
						w={{ lg: "75%", md: "75%", base: "100%" }}
						overflow="auto"
						p="4"
						borderRadius="10px"
						whiteSpace="pre"
						dangerouslySetInnerHTML={{ __html: getUsageCodeSnippet() }}
					/>
				</VStack>
			</VStack>
		</Box>
		<Box maxW="1100px" p="4" w="100%" mx="auto" mb="8">
			<Divider w="100%" />
		</Box>
		<Box id="explanation-section" maxW="1100px" p="4" w="100%" m="0 auto">
			<Text
				fontSize="lg"
				color="gray.600"
				display="flex"
				justifyContent="center"
				mb="4"
			>
				Understand the problem WDL is trying to solve for:
			</Text>
			<Flex gap="8" width="100%" flexWrap="wrap">
				<LoomVideo src="https://www.loom.com/embed/d1b754d47d944e02a9639f097df0a272?sid=15a2a880-3612-479b-8917-68521a53d46a" />
				<LoomVideo src="https://www.loom.com/embed/f14df4ca1b3c48788f7b66d9d1d53dd4?sid=be8d2277-1d1e-4749-b4d6-1217b7428ed9" />
			</Flex>
		</Box>
		<Box as="footer" borderTop="1px solid #efefef" py="8" px="3" mt="12">
			<Text textAlign="center" fontSize="xl" color="gray.500">
				With ❤ from{" "}
				<Link
					href="https://devesh.tech"
					target="_blank"
					rel="noopener noreferrer"
					color="blackAlpha.700"
					fontWeight="500"
				>
					Devesh
				</Link>{" "}
				and{" "}
				<Link
					href="https://solarladder.com"
					target="_blank"
					rel="noopener noreferrer"
					color="teal.600"
					fontWeight="500"
				>
					Solar Ladder
				</Link>
			</Text>
		</Box>
	</>
);

export default Home;
