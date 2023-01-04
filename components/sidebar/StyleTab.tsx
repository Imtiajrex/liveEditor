import { useElementsContext } from "../../contexts/ElementsProvider";
import React, { useContext, useState } from "react";
import {
	ColorInput,
	createStyles,
	Switch,
	Text,
	TextInput,
	Input,
} from "@mantine/core";

export const useStyles = createStyles((theme) => ({
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
export const setStyleValue = ({
	key,
	value,
	setValue,
	getSelectedElement,
	updateSelectedElement,
}) => {
	const selectedElement = getSelectedElement();
	if (selectedElement) {
		console.log(value);
		if ((value == undefined || value == "") && selectedElement.style) {
			delete selectedElement.style[key];
			setValue((prev) => {
				delete prev[key];
				return { ...prev };
			});
			updateSelectedElement(selectedElement);
			return;
		}
		selectedElement.style = { ...selectedElement.style, [key]: value };
		setValue((prevStyle) => ({ ...prevStyle, [key]: value }));
		updateSelectedElement(selectedElement);
	}
};
export default function StyleTab() {
	const {
		getSelectedElement,
		updateSelectedElement,
		selectedElementHierarchy,
	} = useElementsContext();
	const [style, setStyle] = useState({} as React.CSSProperties);
	const [multipleValueCollapse, setMultipleValueCollapse] = useState(
		{} as {
			[key: string]: boolean;
		}
	);

	React.useEffect(() => {
		if (selectedElementHierarchy.length > 0) {
			const element = getSelectedElement();
			if (element && element.style) {
				setStyle(element.style);
			}
		}
	}, [selectedElementHierarchy]);
	const { classes } = useStyles();
	const handleValueChange = ({ key, value }: { key: string; value: any }) =>
		setStyleValue({
			key,
			value,
			setValue: setStyle,
			getSelectedElement,
			updateSelectedElement,
		});
	return (
		<div className={classes.container}>
			{renderInputs({
				inputs,
				setMulti: setMultipleValueCollapse,
				setValue: handleValueChange,
				multi: multipleValueCollapse,
				classes,
				value: style,
			})}
		</div>
	);
}
export const renderInputs = ({
	inputs,
	setMulti,
	setValue,
	multi,
	classes,
	value,
}) => {
	return inputs.map((input) => {
		const handleChange = (val, key = input.key) => {
			const value = input.textField ? val.target.value : val;
			setValue({ key: input.key, value });
		};
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
								checked={multi[input.key]}
								onChange={(event) => {
									setMulti((prev) => ({
										...prev,
										[input.key]: !prev[input.key],
									}));
								}}
								pb={10}
							/>
						</div>

						{multi[input.key] ? (
							<div className={classes.inputs}>
								{input.children.map((child) => (
									<Input.Wrapper label={child.label} key={child.key}>
										<input.input
											placeholder={input.defaultValue}
											value={value[child.key] ?? value[input.key] ?? ""}
											onChange={(value) => handleChange(value, child.key)}
											{...input.props}
										/>
									</Input.Wrapper>
								))}
							</div>
						) : (
							<input.input
								placeholder={input.defaultValue}
								onChange={handleChange}
								value={value[input.key] ?? ""}
								{...input.props}
							/>
						)}
					</>
				)}
				{!input.children && (
					<Input.Wrapper label={input.label}>
						<input.input
							value={value[input.key] ?? ""}
							onChange={handleChange}
							{...input.props}
						/>
					</Input.Wrapper>
				)}
			</div>
		);
	});
};
export type StyleInputType = {
	label: string;
	key?: string;
	input?: React.ForwardedRef<any>;
	defaultValue?: number | string;
	textField?: boolean;
	children?: {
		label: string;
		key: string;
	}[];
	props?: {
		[key: string]: any;
	};
};

const inputs = [
	{
		label: "Background Color",
		key: "backgroundColor",
		input: ColorInput,
		defaultValue: "Choose a color",
		props: {
			format: "rgba",
		},
	},
	{
		label: "Text Color",
		key: "color",
		input: ColorInput,
		defaultValue: "Choose a color",
		props: {
			format: "rgba",
		},
	},
	{
		label: "Font Size",
		key: "fontSize",
		input: TextInput,
		textField: true,
	},
	{
		label: "Font weight",
		key: "fontWeight",
		input: TextInput,
		textField: true,
	},

	{
		label: "Padding",
		key: "padding",
		input: TextInput,
		textField: true,
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
		input: TextInput,
		textField: true,
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
] as StyleInputType[];
