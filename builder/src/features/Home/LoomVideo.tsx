import { Box } from "@chakra-ui/react";

const LoomVideo = ({ src }: { src: string }) => {
	return (
		<Box
			width='100%'
			borderRadius="15px"
			overflow="hidden"
			p="2"
			bg="#333333"
		>
			<Box
				width="100%"
				height="100%"
				borderRadius="10px"
				overflow="hidden"
			>
				<div
					style={{
						position: "relative",
						paddingBottom: "56.25%",
						height: "100%",
						width: "100%",
					}}
				>
					<iframe
						src={src}
						frameBorder="0"
						allowFullScreen
						style={{
							position: "absolute",
							top: 0,
							left: 0,
							width: "100%",
							height: "100%",
						}}
					></iframe>
				</div>
			</Box>
		</Box>
	);
};

export default LoomVideo;
