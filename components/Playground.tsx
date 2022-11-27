import React, { useEffect, useState } from "react";
import { useDrop } from "react-dnd";
import { TablerIcon } from "@tabler/icons";
import { ItemType } from "./Sidebar";
type ElementType = ItemType & {
	children?: ElementType[];
	hierarchy: HierarchyType;
};
// const getTopParent = (hierarchy: HierarchyType) => {
// 	let topParent = hierarchy;
// 	while (topParent.parent) {
// 		topParent = topParent.parent;
// 	}
// 	return topParent;
// };
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
export default function Playground() {
	const [elements, setElements] = useState<ElementType[]>([]);
	const addElement = ({ item, hierarchy }: AddElementArgs) => {
		setElements((prev) => {
			let newElements = [
				...prev,
				{
					title: item.title,
					Icon: item.Icon,
					id: item.id,
					Component: item.Component,
					hierarchy: [prev.length],
				},
			] as ElementType[];

			if (hierarchy !== undefined) {
				newElements = [...prev];

				const goDeep = (elements: ElementType[], hierarchy: number[]) => {
					const topParent = hierarchy.pop();
					elements.forEach((element, index) => {
						if (index == topParent) {
							const newElement = {
								title: item.title,
								Icon: item.Icon,
								id: item.id,
								Component: item.Component,
							};
							if (hierarchy.length == 0) {
								if (element.children != undefined) {
									element.children.push({
										...newElement,
										hierarchy: [element.children.length, ...element.hierarchy],
									});
								} else {
									element.children = [
										{ ...newElement, hierarchy: [0, ...element.hierarchy] },
									];
								}
							} else {
								if (element.children != undefined)
									goDeep(element.children, hierarchy);
							}
						}
					});
				};
				goDeep(newElements, [...hierarchy]);
			}

			return newElements;
		});
	};
	const [{ isOver, isOverCurrent }, drop] = useDrop(dropFunc(addElement));

	const renderElements = (elements: ElementType[]) =>
		elements.map((element: ElementType, index) => {
			return (
				<Element
					Component={element.Component}
					key={index}
					addElement={addElement}
					index={index}
					hierarchy={element.hierarchy}
				>
					{element.children && renderElements(element.children)}
				</Element>
			);
		});

	return (
		<div className={"playground"} ref={drop}>
			{renderElements(elements)}
		</div>
	);
}
const Element = ({
	children,
	Component,
	addElement,
	index,
	hierarchy,
}: {
	children: React.ReactNode;
	Component: React.ElementType;
	addElement: AddElementFunctionType;
	index: number;
	hierarchy: HierarchyType;
}) => {
	return (
		<Component addElement={addElement} index={index} hierarchy={hierarchy}>
			{children}
		</Component>
	);
};
type AddElementArgs = {
	item: ItemType;
	hierarchy?: HierarchyType;
};
export type AddElementFunctionType = (element: AddElementArgs) => void;

export type HierarchyType = number[];
// {
// 	parent: HierarchyType;
// 	index: number;
// 	child: HierarchyType;
// };
