import { ElementsContext } from "../../contexts/ElementsProvider";
import React, { useContext, useState } from "react";
import {
	ColorInput,
	createStyles,
	NumberInput,
	Switch,
	Text,
} from "@mantine/core";

const useStyles = createStyles((theme) => ({
	container: {
		padding: theme.spacing.md,
	},
	inputGroup: {
		marginBottom: theme.spacing.lg,
	},
	inputs: {
		display: "flex",
		marginTop: theme.spacing.xs,
	},
	labelGroup: {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
	},
}));
export default function StyleTab() {
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
	const { classes } = useStyles();
	const renderInputs = () => {
		return inputs.map((input) => {
			return (
				<div className={classes.inputGroup} key={input.key}>
					{input.children && (
						<>
							<div className={classes.labelGroup}>
								<Text size="sm" weight={"bold"} color={"gray.7"}>
									{input.label}
								</Text>
								<Switch
									label="Multi Value"
									checked={multipleValueCollapse[input.key]}
									onChange={(event) => {
										setMultipleValueCollapse((prev) => ({
											...prev,
											[input.key]: !prev[input.key],
										}));
									}}
								/>
							</div>

							{multipleValueCollapse[input.key] ? (
								<div className={classes.inputs}>
									{input.children.map((child) => (
										<input.input
											key={child.key}
											label={child.label}
											placeholder={input.defaultValue}
											value={style[child.key]}
											onChange={(value) =>
												setStyleValue({ key: child.key, value })
											}
										/>
									))}
								</div>
							) : (
								<input.input
									placeholder={input.defaultValue}
									onChange={(value) => setStyleValue({ key: input.key, value })}
								/>
							)}
						</>
					)}
					{!input.children && (
						<input.input
							label={input.label}
							value={style[input.key]}
							onChange={(value) => setStyleValue({ key: input.key, value })}
						/>
					)}
				</div>
			);
		});
	};
	return <div className={classes.container}>{renderInputs()}</div>;
}

const inputs = [
	{
		label: "Background Color",
		key: "backgroundColor",
		input: ColorInput,
		defaultValue: "#fff",
	},

	{
		label: "Padding",
		key: "padding",
		input: NumberInput,
		defaultValue: "20",
		children: [
			{
				label: "Top",
				key: "paddingTop",
			},
			{
				label: "Bottom",
				key: "paddingBottom",
			},
			{
				label: "Left",
				key: "paddingLeft",
			},
			{
				label: "Right",
				key: "paddingRight",
			},
		],
	},
	{
		label: "Margin",
		key: "margin",
		input: NumberInput,
		defaultValue: "0",
		children: [
			{
				label: "Top",
				key: "marginTop",
			},
			{
				label: "Bottom",
				key: "marginBottom",
			},
			{
				label: "Left",
				key: "marginLeft",
			},
			{
				label: "Right",
				key: "marginRight",
			},
		],
	},
];
