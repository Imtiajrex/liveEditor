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
};
export const ElementsContext = createContext({} as ElementsContextType);

export default function ElementsProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [elements, setElements] = useState<ElementType[]>([]);
	const addElement = ({ item, hierarchy }: AddElementArgs) => {
		setElements((prev) => {
			const newElement = {
				title: item.title,
				Icon: item.Icon,
				id: item.id,
				Component: item.Component,
			} as ElementType;
			const newElements = _.cloneDeep(prev) as ElementType[];
			if (hierarchy !== undefined) {
				traverse(newElements, [...hierarchy], newElement);
			} else {
				newElements.push({
					title: item.title,
					Icon: item.Icon,
					id: item.id,
					Component: item.Component,
					hierarchy: [prev.length],
				});
			}
			return [...newElements];
		});
	};
	const reset = () => {
		setElements([]);
	};
	return (
		<ElementsContext.Provider value={{ elements, addElement, reset }}>
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
