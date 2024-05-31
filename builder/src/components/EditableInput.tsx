import React from "react";
import { Button, Input, Textarea, Tooltip } from "@chakra-ui/react";
import { MdSend } from "react-icons/md";

interface Props {
	children?: React.ReactNode | React.ReactNode[];
	placeholder?: string;
	value: string;
	onSubmit: (newVal: string) => void;
	as?: "input" | "textarea";
}

const EditableInput = (props: Props) => {
	const [labelDimensions, setLabelDimensions] = React.useState({
		width: 0,
		height: 0,
	});
	const [isEditingActive, setIsEditingActive] = React.useState(false);
	const [value, setValue] = React.useState(props.value || "");

	const labelWrapperRef = React.useRef<HTMLDivElement>(null);

	React.useEffect(() => {
		if (!isEditingActive) {
			const { height, width } =
				labelWrapperRef.current?.getBoundingClientRect?.() || {
					height: 0,
					width: 0,
				};
			setLabelDimensions({ height, width });
		}
	}, [isEditingActive, props, value]);

	React.useEffect(() => setValue(props.value), [props.value]);

	const onSubmit: React.FormEventHandler = (event) => {
		event.preventDefault();
		props.onSubmit(value);
		setIsEditingActive(false);
	};

	React.useEffect(() => {
		const checkForEscapeKey = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				setIsEditingActive(false);
				setValue(props.value || "");
			}
		};

		window.addEventListener("keydown", checkForEscapeKey);
		return () => window.removeEventListener("keydown", checkForEscapeKey);
	}, [props.value]);

	React.useEffect(() => {
		if (!isEditingActive) setValue(props.value);
	}, [isEditingActive, props.value]);

	return isEditingActive ? (
		<form onSubmit={onSubmit}>
			{!props.as || props.as === "input" ? (
				<Input
					placeholder={props.placeholder}
					height={Number(labelDimensions.height + 10) + "px"}
					width={Number(labelDimensions.width + 10) + "px"}
					autoFocus
					fontSize={Number(labelDimensions.height - 10) + "px"}
					value={value}
					onChange={(e) => setValue(e.target.value)}
				/>
			) : (
				<>
					<Textarea
						placeholder={props.placeholder}
						height={Number(labelDimensions.height) + "px"}
						width="100%"
						resize="none"
						autoFocus
						value={value}
						onChange={(e) => setValue(e.target.value)}
						mb="4"
					/>
					<Button type="submit" colorScheme="blue" rightIcon={<MdSend />}>
						Update
					</Button>
				</>
			)}
		</form>
	) : (
		<div
			style={{ maxWidth: "fit-content", cursor: "pointer" }}
			ref={labelWrapperRef}
			onClick={() => setIsEditingActive(true)}
		>
			<Tooltip label="Tap to edit">{props.children || props.value}</Tooltip>
		</div>
	);
};

export default EditableInput;
