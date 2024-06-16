import { useRef } from "react";

import { MdDownload, MdResetTv, MdUpload } from "react-icons/md";
import { Button, HStack } from "@chakra-ui/react";

import useExportAndImportWorkflow from "../hooks/use-export-and-import-workflow";
import useResetWorkflow from "../hooks/use-reset-workflow";

const ExportAndImport = () => {
	const { exportWorkflow, importWorkflow } = useExportAndImportWorkflow();
	const { resetWorkflow, isResettable } = useResetWorkflow();

	const fileUploadInputRef = useRef<HTMLInputElement | null>(null);

	return (
		<HStack gap="1rem" justifyContent="center">
			<Button
				colorScheme="teal"
				leftIcon={<MdDownload />}
				onClick={exportWorkflow}
			>
				Export
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
			<Button
				leftIcon={<MdResetTv />}
				colorScheme="red"
				variant="ghost"
				onClick={resetWorkflow}
				isDisabled={!isResettable}
			>
				Reset
			</Button>
		</HStack>
	);
};

export default ExportAndImport;
