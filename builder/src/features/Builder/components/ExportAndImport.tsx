import { useRef } from "react";

import { MdDownload, MdUpload } from "react-icons/md";
import { Button, HStack } from "@chakra-ui/react";

import useExportAndImportWorkflow from "../hooks/use-export-and-import-workflow";

const ExportAndImport = () => {
	const { exportWorkflow, importWorkflow } = useExportAndImportWorkflow();
	const fileUploadInputRef = useRef<HTMLInputElement | null>(null);

	return (
		<HStack gap="1rem" justifyContent="center">
			<Button
				colorScheme="teal"
				leftIcon={<MdDownload />}
				onClick={exportWorkflow}
			>
				Export For Later
			</Button>
			<Button
				leftIcon={<MdUpload />}
				onClick={() =>
					fileUploadInputRef.current ? fileUploadInputRef.current.click() : null
				}
			>
				Import
			</Button>
			<input
				type="file"
				ref={fileUploadInputRef}
				style={{ display: "none" }}
				onChange={(event) => {
					importWorkflow(
						event.target.files ? event.target.files[0] : undefined
					);
				}}
			/>
		</HStack>
	);
};

export default ExportAndImport;
