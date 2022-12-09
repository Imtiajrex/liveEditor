import { createContext, useContext, useEffect, useState } from "react";
import {
	AddElementArgs,
	AddElementFunctionType,
	ElementType,
} from "../types/elements";
import _ from "lodash";
type ElementsContextType = {
	elements: ElementType[];
	addElement: AddElementFunctionType;
	reset: () => void;
	selectElement: (hierarchy: number[]) => void;
	selectedElementHierarchy: number[];
	getSelectedElement: () => ElementType | null;
	updateSelectedElement: (item: ElementType) => void;
	resetSelectedElement: () => void;
	deleteElement: (hierarchy: number[]) => void;
};
export const ElementsContext = createContext({} as ElementsContextType);
export const useElementsContext = () => useContext(ElementsContext);
const createComponentID = ({
	key,
	hierarchy = [],
	length = 0,
}: {
	key: string;
	hierarchy?: number[];
	length?: number;
}) => `${key}_${hierarchy.length > 0 ? hierarchy.join("_") : length}`;
export default function ElementsProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [elements, setElements] = useState<ElementType[]>([]);
	const [selectedElementHierarchy, setSelectedElementHierarchy] = useState<
		number[]
	>([]);
	const addElement = ({
		item,
		hierarchy,
		position = "bottom",
	}: AddElementArgs) => {
		setElements((prev) => {
			const id = createComponentID({
				key: item.componentKey,
				hierarchy,
				length: prev.length,
			});
			console.log(hierarchy, id);
			const newElement = {
				...item,
				id,
			} as ElementType;
			const newElements = _.cloneDeep(prev) as ElementType[];
			if (hierarchy !== undefined) {
				traverse({
					elements: newElements,
					hierarchy,
					item: newElement,
				});
			} else {
				if (position == "bottom")
					newElements.push({ ...newElement, hierarchy: [prev.length] });
				else {
					let updatedElements = [
						{ ...newElement, hierarchy: [0] },
						...newElements,
					];
					updatedElements = updatedElements.map((item, index) => ({
						...item,
						hierarchy: [index],
					}));
					return updatedElements;
				}
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
	const deleteElement = (hierarchy: number[]) => {
		console.log("delete element");
		if (hierarchy.length > 0) {
			// const newElements = _.cloneDeep(elements);
			// traverse({
			// 	elements: newElements,
			// 	hierarchy,
			// 	item: {} as ElementType,
			// 	remove: true,
			// });
			// setElements(newElements);
		} else {
			setElements((prev) =>
				prev.filter(
					(item, index) => item.hierarchy.join("") != hierarchy.join("")
				)
			);
		}
	};
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
				deleteElement,
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
	remove = false,
}: {
	elements: ElementType[];
	hierarchy: number[];
	item: ElementType;
	assign?: boolean;
	returnValue?: boolean;
	returnElement?: { item: ElementType };
	remove?: boolean;
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
				if (remove) {
					const updatedElement = elements.filter(
						(item, elementIdx) => elementIdx != index
					);
					elements = updatedElement.map((item, index) => {
						return {
							...item,
							hierarchy: item.hierarchy.map((item, idx) =>
								idx == 0 ? index : item
							),
						};
					});
					return;
				}
				const children = _.cloneDeep(element.children || []);
				const newHierarchy = [children.length, ...element.hierarchy];
				children.push({
					...item,
					hierarchy: newHierarchy,
					id: createComponentID({
						key: item.componentKey,
						hierarchy: newHierarchy,
					}),
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
