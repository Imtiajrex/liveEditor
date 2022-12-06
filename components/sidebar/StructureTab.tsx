import { ElementsContext } from "../../contexts/ElementsProvider";
import React, { useContext, useState } from "react";
import { renderInputs, StyleInputType, useStyles } from "./StyleTab";
import { SegmentedControl, Center, TextInput } from "@mantine/core";
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
	} = useContext(ElementsContext);
	const [style, setStyle] = useState({} as React.CSSProperties);
	const [multipleValueCollapse, setMultipleValueCollapse] = useState(
		{} as {
			[key: string]: boolean;
		}
	);

	React.useEffect(() => {
		if (selectedElementHierarchy.length > 0) {
			const element = getSelectedElement();
			console.log(element && element.style);
			if (element && element.style) setStyle(element.style);
		}
	}, [selectedElementHierarchy]);
	const setStyleValue = ({ key, value }) => {
		const selectedElement = getSelectedElement();
		if (selectedElement) {
			selectedElement.style = { ...selectedElement.style, [key]: value };
			setStyle((prevStyle) => ({ ...prevStyle, [key]: value }));
			updateSelectedElement(selectedElement);
		}
	};
	return (
		<div className={classes.container}>
			{renderInputs({
				inputs,
				setMultipleValueCollapse,
				setStyleValue,
				multipleValueCollapse,
				classes,
				style,
			})}
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
		props: {
			textField: true,
			placeholder: "auto",
		},
	},
] as StyleInputType[];
