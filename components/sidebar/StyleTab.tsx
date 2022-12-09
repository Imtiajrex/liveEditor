import { useElementsContext } from "../../contexts/ElementsProvider";
import React, { useContext, useState } from "react";
import {
	ColorInput,
	createStyles,
	NumberInput,
	Switch,
	Text,
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
	const setStyleValue = ({ key, value }) => {
		const selectedElement = getSelectedElement();
		if (selectedElement) {
			if (value == undefined && selectedElement.style) {
				delete selectedElement.style[key];
				setStyle((prev) => {
					delete prev[key];
					return { ...prev };
				});
				updateSelectedElement(selectedElement);
				return;
			}
			selectedElement.style = { ...selectedElement.style, [key]: value };
			setStyle((prevStyle) => ({ ...prevStyle, [key]: value }));
			updateSelectedElement(selectedElement);
		}
	};
	const { classes } = useStyles();

	return (
		<div className={classes.container}>
			{renderInputs({
				inputs,
				setMulti: setMultipleValueCollapse,
				setValue: setStyleValue,
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
		const handleChange = (val) => {
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
							/>
						</div>

						{multi[input.key] ? (
							<div className={classes.inputs}>
								{input.children.map((child) => (
									<Input.Wrapper label={child.label} key={child.key}>
										<input.input
											placeholder={input.defaultValue}
											value={value[child.key] ?? value[input.key] ?? ""}
											onChange={(value) => setValue({ key: child.key, value })}
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
		input: NumberInput,
	},
	{
		label: "Font weight",
		key: "fontWeight",
		input: NumberInput,
	},

	{
		label: "Padding",
		key: "padding",
		input: NumberInput,
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
