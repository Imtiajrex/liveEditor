import { ElementsContext } from "../../contexts/ElementsProvider";
import React, { useContext, useState } from "react";
import { ColorInput } from "@mantine/core";
export default function StyleTab() {
	const {
		getSelectedElement,
		updateSelectedElement,
		selectedElementHierarchy,
	} = useContext(ElementsContext);
	const [style, setStyle] = useState({} as React.CSSProperties);

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
	return (
		<div>
			<ColorInput
				placeholder="Pick color"
				label="Background Color"
				value={style.backgroundColor}
				onChange={(value) => {
					setStyleValue({ key: "backgroundColor", value });
				}}
			/>
		</div>
	);
}
