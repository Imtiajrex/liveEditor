import { useElementsContext } from "../../contexts/ElementsProvider";
import React, { useContext, useState } from "react";
import { renderInputs, StyleInputType, useStyles } from "./StyleTab";
import { SegmentedControl, Center, TextInput, Text } from "@mantine/core";
import {
	IconDirectionHorizontal,
	IconLayoutAlignBottom,
	IconLayoutAlignCenter,
	IconLayoutAlignLeft,
	IconLayoutAlignMiddle,
	IconLayoutAlignRight,
	IconLayoutAlignTop,
	IconLayoutDistributeHorizontal,
	IconLayoutDistributeVertical,
} from "@tabler/icons";

export default function StructureTab() {
	const { classes } = useStyles();

	const {
		getSelectedElement,
		updateSelectedElement,
		selectedElementHierarchy,
	} = useElementsContext();
	const [content, setContent] = useState({
		content: "",
	});
	const [style, setStyle] = useState({} as React.CSSProperties);
	const [multipleValueCollapse, setMultipleValueCollapse] = useState(
		{} as {
			[key: string]: boolean;
		}
	);

	React.useEffect(() => {
		if (selectedElementHierarchy.length > 0) {
			const element = getSelectedElement();
			if (element && element.style) setStyle(element.style);
			setContent({ content: element?.content ?? "" });
		} else {
			cleanup();
		}
		return cleanup();
	}, [selectedElementHierarchy]);
	const cleanup = () => {
		setMultipleValueCollapse({});
		setContent({
			content: "",
		});
	};
	const setStyleValue = ({ key, value }) => {
		const selectedElement = getSelectedElement();
		if (selectedElement) {
			selectedElement.style = { ...selectedElement.style, [key]: value };
			setStyle((prevStyle) => ({ ...prevStyle, [key]: value }));
			updateSelectedElement(selectedElement);
		}
	};
	const handleContent = (e) => {
		const selectedElement = getSelectedElement();
		if (selectedElement) {
			const value = e.target.value;
			selectedElement.content = value;
			setContent((prev) => ({ ...prev, content: value }));
			updateSelectedElement(selectedElement);
		}
	};
	return (
		<div className={classes.container}>
			<Text weight={700} size="lg">
				Structure
			</Text>
			{renderInputs({
				inputs,
				setMultipleValueCollapse,
				setValue: setStyleValue,
				multipleValueCollapse,
				classes,
				value: style,
			})}
			<Text weight={700} size="lg">
				Contents
			</Text>
			<TextInput
				label="Content"
				placeholder="Enter Content here"
				value={content.content ?? ""}
				onChange={handleContent}
			/>
		</div>
	);
}

const inputs = [
	{
		label: "Direction",
		key: "flexDirection",
		input: SegmentedControl,
		props: {
			fullWidth: true,
			data: [
				{
					label: (
						<Center>
							<IconLayoutDistributeHorizontal size={22} />
						</Center>
					),
					value: "row",
				},
				{
					label: (
						<Center>
							<IconLayoutDistributeVertical size={22} />
						</Center>
					),
					value: "column",
				},
			],
		},
	},
	{
		label: "Justify Content",
		key: "justifyContent",
		input: SegmentedControl,
		props: {
			fullWidth: true,
			data: [
				{
					label: (
						<Center>
							<IconLayoutAlignLeft size={22} />
						</Center>
					),
					value: "flex-start",
				},
				{
					label: (
						<Center>
							<IconLayoutAlignCenter size={22} />
						</Center>
					),
					value: "center",
				},
				{
					label: (
						<Center>
							<IconLayoutAlignRight size={22} />
						</Center>
					),
					value: "flex-end",
				},
			],
		},
	},
	{
		label: "Align Items",
		key: "alignItems",
		input: SegmentedControl,
		props: {
			fullWidth: true,
			data: [
				{
					label: (
						<Center>
							<IconLayoutAlignTop size={22} />
						</Center>
					),
					value: "flex-start",
				},
				{
					label: (
						<Center>
							<IconLayoutAlignMiddle size={22} />
						</Center>
					),
					value: "center",
				},
				{
					label: (
						<Center>
							<IconLayoutAlignBottom size={22} />
						</Center>
					),
					value: "flex-end",
				},
			],
		},
	},
	{
		label: "Height",
		key: "height",
		input: TextInput,
		textField: true,
		props: {
			placeholder: "auto",
		},
	},
] as StyleInputType[];
