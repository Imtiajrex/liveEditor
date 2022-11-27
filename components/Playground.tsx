import React, { useContext, useState } from "react";
import { useDrop } from "react-dnd";
import { ElementsContext, ElementType } from "../contexts/ElementsProvider";
import styles from "styles/Playground.module.scss";
import { createStyles } from "@mantine/core";
export const dropFunc = (addElement) => ({
	accept: "Element",
	drop: (item: any, monitor) => {
		const didDrop = monitor.didDrop();
		if (didDrop) {
			return;
		}
		addElement({ item });
	},
	collect: (monitor) => ({
		isOver: monitor.isOver(),
		isOverCurrent: monitor.isOver({ shallow: true }),
	}),
});

const useStyles = createStyles((theme) => ({
	playground: { width: "100%", minHeight: "100vh", marginLeft: 346 },
	collapsed: {
		marginLeft: "270px!important",
	},
}));

export default function Playground() {
	const { addElement, elements, reset, selectedElement } =
		useContext(ElementsContext);
	const [{ isOver, isOverCurrent }, drop] = useDrop(dropFunc(addElement));

	const { classes } = useStyles();
	const renderElements = (elements: ElementType[]) =>
		elements.map((element: ElementType, index) => {
			return (
				<Element {...element} key={index}>
					{element.children && renderElements(element.children)}
				</Element>
			);
		});

	return (
		<div
			className={`${classes.playground} ${
				selectedElement.length == 0 && classes.collapsed
			}`}
			ref={drop}
		>
			<div
				style={{ position: "fixed", top: 25, right: 25, cursor: "pointer" }}
				onClick={() => reset()}
			>
				Reset
			</div>
			{renderElements(elements)}
		</div>
	);
}
export type ElementComponentType = Omit<ElementType, "children"> & {
	children?: React.ReactNode;
};
const Element = ({ children, Component, hierarchy }: ElementComponentType) => {
	return <Component hierarchy={hierarchy}>{children}</Component>;
};