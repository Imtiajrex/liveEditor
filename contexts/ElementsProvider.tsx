import { createContext, useState } from "react";
import {
	AddElementArgs,
	AddElementFunctionType,
	ItemType,
} from "../types/elements";
import _ from "lodash";
export type ElementType = ItemType & {
	children?: ElementType[];
	hierarchy: number[];
};
type ElementsContextType = {
	elements: ElementType[];
	addElement: AddElementFunctionType;
	reset: () => void;
	selectElement: (hierarchy: number[]) => void;
	selectedElement: number[];
};
export const ElementsContext = createContext({} as ElementsContextType);

export default function ElementsProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [elements, setElements] = useState<ElementType[]>([]);
	const [selectedElement, setSelectedElement] = useState<number[]>([]);
	const addElement = ({ item, hierarchy }: AddElementArgs) => {
		setElements((prev) => {
			const newElement = {
				title: item.title,
				Icon: item.Icon,
				Component: item.Component,
			} as ElementType;
			const newElements = _.cloneDeep(prev) as ElementType[];
			if (hierarchy !== undefined) {
				traverse(newElements, [...hierarchy], newElement);
			} else {
				newElements.push({ ...newElement, hierarchy: [prev.length] });
			}
			return [...newElements];
		});
	};
	const reset = () => {
		setElements([]);
	};
	const selectElement = (hierarchy: number[]) => {
		setSelectedElement(hierarchy);
	};
	return (
		<ElementsContext.Provider
			value={{ elements, addElement, reset, selectElement, selectedElement }}
		>
			{children}
		</ElementsContext.Provider>
	);
}

const traverse = (
	elements: ElementType[],
	hierarchy: number[],
	item: ElementType
) => {
	const topParent = hierarchy.pop();
	elements.forEach((element, index) => {
		if (index == topParent) {
			if (hierarchy.length == 0) {
				const children = _.cloneDeep(element.children || []);

				children.push({
					...item,
					hierarchy: [children.length, ...element.hierarchy],
				});
				element.children = children;
			} else {
				if (element.children != undefined)
					traverse(element.children, hierarchy, item);
			}
		}
	});
};
