import { createContext, useEffect, useState } from "react";
import {
	AddElementArgs,
	AddElementFunctionType,
	ItemType,
} from "../types/elements";
import _ from "lodash";
export type ElementType = ItemType & {
	children?: ElementType[];
	hierarchy: number[];
	id: string;
	style?: React.CSSProperties;
};
type ElementsContextType = {
	elements: ElementType[];
	addElement: AddElementFunctionType;
	reset: () => void;
	selectElement: (hierarchy: number[]) => void;
	selectedElementHierarchy: number[];
	getSelectedElement: () => ElementType | null;
	updateSelectedElement: (item: ElementType) => void;
	resetSelectedElement: () => void;
};
export const ElementsContext = createContext({} as ElementsContextType);

export default function ElementsProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [elements, setElements] = useState<ElementType[]>([]);
	const [selectedElementHierarchy, setSelectedElementHierarchy] = useState<
		number[]
	>([]);
	const addElement = ({ item, hierarchy }: AddElementArgs) => {
		setElements((prev) => {
			const newElement = { ...item, id: Date.now().toString() } as ElementType;
			const newElements = _.cloneDeep(prev) as ElementType[];
			if (hierarchy !== undefined) {
				traverse({
					elements: newElements,
					hierarchy,
					item: newElement,
				});
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
		setSelectedElementHierarchy(hierarchy);
	};
	const checkIfSelectedExists = () => {
		if (selectedElementHierarchy.length > 0) {
			const selected = getSelectedElement();
			if (!selected) {
				setSelectedElementHierarchy([]);
			}
		}
	};
	useEffect(() => {
		checkIfSelectedExists();
	}, [elements]);

	const getSelectedElement = () => {
		if (selectedElementHierarchy.length == 0) return null;
		let selected = { item: {} } as { item: ElementType };
		traverse({
			elements: _.cloneDeep(elements),
			hierarchy: [...selectedElementHierarchy],
			item: {} as ElementType,
			returnValue: true,
			returnElement: selected,
		});

		return _.cloneDeep(selected.item) as ElementType;
	};
	const updateSelectedElement = (item: ElementType) => {
		//update selected element from elements array using selectedElement stack
		const hierarchy = _.cloneDeep(item.hierarchy);
		if (hierarchy && hierarchy.length > 0) {
			const newElements = _.cloneDeep(elements);
			traverse({
				elements: newElements,
				hierarchy,
				item,
				assign: true,
			});
			console.log(item, newElements);
			setElements(newElements);
		}
	};
	const resetSelectedElement = () => {
		setSelectedElementHierarchy([]);
	};
	return (
		<ElementsContext.Provider
			value={{
				elements,
				addElement,
				reset,
				selectElement,
				selectedElementHierarchy,
				getSelectedElement,
				updateSelectedElement,
				resetSelectedElement,
			}}
		>
			{children}
		</ElementsContext.Provider>
	);
}

const traverse = ({
	elements,
	hierarchy,
	item,
	assign = false,
	returnValue = false,
	returnElement,
}: {
	elements: ElementType[];
	hierarchy: number[];
	item: ElementType;
	assign?: boolean;
	returnValue?: boolean;
	returnElement?: { item: ElementType };
}) => {
	const topParent = hierarchy.pop();
	elements.forEach((element, index) => {
		if (index == topParent) {
			if (hierarchy.length == 0) {
				if (returnValue && returnElement) {
					returnElement.item = element;
					return;
				}
				if (assign) {
					elements[index] = item;
					return;
				}
				const children = _.cloneDeep(element.children || []);
				children.push({
					...item,
					hierarchy: [children.length, ...element.hierarchy],
				});
				element.children = children;
			} else {
				if (element.children != undefined)
					traverse({
						elements: element.children,
						hierarchy,
						item,
						assign,
						returnElement,
						returnValue,
					});
			}
		}
	});
};
