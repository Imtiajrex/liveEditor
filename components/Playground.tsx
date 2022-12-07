import React, { useContext, useState } from "react";
import { useDrop } from "react-dnd";
import { createStyles } from "@mantine/core";
import { componentMap, ElementType } from "../types/elements";
import { useElementsContext } from "../contexts/ElementsProvider";
export const dropFunc = (
	addElement,
	position = "bottom" as "top" | "bottom"
) => ({
	accept: "Element",
	drop: (item: ElementType, monitor) => {
		const didDrop = monitor.didDrop();
		if (didDrop) {
			return;
		}
		addElement({ item, position });
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
	top: {
		padding: 35,
	},
	bottom: {
		padding: 35,
	},
	over: {
		border: `3px solid rgb(80, 202, 192) !important`,
	},
}));

export default function Playground() {
	const {
		addElement,
		elements,
		reset,
		selectedElementHierarchy,
		resetSelectedElement,
	} = useElementsContext();

	const [{ isOver, isOverCurrent }, drop] = useDrop(
		dropFunc(addElement, "bottom")
	);

	const [topOver, topDrop] = useDrop(dropFunc(addElement, "top"));

	const { classes } = useStyles();
	const renderElements = (elements: ElementType[]) =>
		elements.map((element: ElementType, index) => (
			<Element
				{...element}
				Component={componentMap[element.componentKey]}
				key={index}
			>
				{element.children && renderElements(element.children)}
			</Element>
		));

	const handleClick = () => {
		resetSelectedElement();
	};
	const overClass = isOverCurrent && classes.over;
	return (
		<div
			className={`${classes.playground} ${
				selectedElementHierarchy.length == 0 && classes.collapsed
			}`}
			ref={drop}
			onClick={handleClick}
		>
			{isOver && elements.length > 0 && (
				<div
					className={`${classes.top}  ${topOver.isOverCurrent && classes.over}`}
					ref={topDrop}
				></div>
			)}
			<div
				style={{ position: "fixed", top: 25, right: 25, cursor: "pointer" }}
				onClick={() => reset()}
			>
				Reset
			</div>
			{renderElements(elements)}
			{isOver && elements.length > 0 && (
				<div className={`${classes.bottom}  ${overClass}`} />
			)}
		</div>
	);
}
export type ElementComponentType = Omit<
	Omit<ElementType, "children">,
	"Component"
> & {
	children?: React.ReactNode;
	Component: React.FC<any>;
};
const Element = (elementProps: ElementComponentType) => {
	const { Component, children } = elementProps;
	return <Component {...elementProps}>{children}</Component>;
};
