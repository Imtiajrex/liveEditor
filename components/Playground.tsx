import React, { useContext, useState } from "react";
import { useDrop } from "react-dnd";
import { ElementsContext, ElementType } from "../contexts/ElementsProvider";
import styles from "styles/Playground.module.scss";
import { createStyles } from "@mantine/core";
export const dropFunc = (addElement) => ({
	accept: "Element",
	drop: (item: ElementType, monitor) => {
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
	playground: { width: "100%", minHeight: "100vh", marginLeft: 362 },
	collapsed: {
		marginLeft: "270px!important",
	},
}));

export default function Playground() {
	const {
		addElement,
		elements,
		reset,
		selectedElementHierarchy,
		resetSelectedElement,
	} = useContext(ElementsContext);
	const [{ isOver, isOverCurrent }, drop] = useDrop(dropFunc(addElement));

	const { classes } = useStyles();
	const renderElements = (elements: ElementType[]) =>
		elements.map((element: ElementType, index) => (
			<Element {...element} key={index}>
				{element.children && renderElements(element.children)}
			</Element>
		));

	const handleClick = () => {
		resetSelectedElement();
	};
	return (
		<div
			className={`${classes.playground} ${
				selectedElementHierarchy.length == 0 && classes.collapsed
			}`}
			ref={drop}
			onClick={handleClick}
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
const Element = (elementProps: ElementComponentType) => {
	const { Component, children } = elementProps;
	return <Component {...elementProps}>{children}</Component>;
};
