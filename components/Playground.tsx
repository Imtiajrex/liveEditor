import React from "react";
import { useDrop } from "react-dnd";
import { createStyles, ActionIcon } from "@mantine/core";
import { componentMap, ElementType } from "../types/elements";
import { useElementsContext } from "../contexts/ElementsProvider";
import { IconTrash } from "@tabler/icons";
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
	elementContainer: {
		position: "relative",
	},
	actions: {
		display: "flex",
		position: "fixed",
		top: 20,
		right: 20,
		background: theme.colors.gray[3],
		padding: `5px 10px`,
		borderRadius: 8,
		boxShadow: theme.shadows.sm,
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
	const handleOutsideClick = () => {
		resetSelectedElement();
	};
	const overClass = isOverCurrent && classes.over;
	return (
		<div
			className={`${classes.playground} ${
				selectedElementHierarchy.length == 0 && classes.collapsed
			}`}
			ref={drop}
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
			<Elements elements={elements} />
			{isOver && elements.length > 0 && (
				<div className={`${classes.bottom}  ${overClass}`} />
			)}
		</div>
	);
}
const Elements = ({ elements }: { elements: ElementType[] }) => (
	<>
		{elements.map((element: ElementType, index) => (
			<Element
				{...element}
				Component={componentMap[element.componentKey]}
				key={index}
			>
				{element.children && element.children.length > 0 && (
					<Elements elements={element.children} />
				)}
			</Element>
		))}
	</>
);

export type ElementComponentType = Omit<
	Omit<ElementType, "children">,
	"Component"
> & {
	children?: React.ReactNode;
	Component: React.FC<any>;
};
const Element = (elementProps: ElementComponentType) => {
	const { Component, children } = elementProps;
	const { classes } = useStyles();
	const { selectedElementHierarchy, deleteElement } = useElementsContext();
	const selected =
		selectedElementHierarchy.join("") == elementProps.hierarchy.join("");

	return (
		<div>
			<Component {...elementProps}>{children}</Component>
			{selected && (
				<div className={classes.actions}>
					<ActionIcon
						color={"red.8"}
						bg="gray.1"
						size={"sm"}
						title="Delete"
						onMouseOver={(e) => {
							e.stopPropagation();
						}}
						onClick={(e) => {
							e.stopPropagation();
							deleteElement(elementProps.hierarchy);
						}}
					>
						<IconTrash size={12} />
					</ActionIcon>
				</div>
			)}
		</div>
	);
};
