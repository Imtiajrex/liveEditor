import { createContext, useContext, useEffect, useState } from "react";
import {
	AddElementArgs,
	AddElementFunctionType,
	ElementType,
	hierarchyType,
} from "../types/elements";
import _ from "lodash";
type ElementsContextType = {
	elements: ElementType[];
	addElement: AddElementFunctionType;
	reset: () => void;
	selectElement: (hierarchy: hierarchyType) => void;
	selectedElementHierarchy: hierarchyType;
	getSelectedElement: () => ElementType | null;
	updateSelectedElement: (item: ElementType) => void;
	resetSelectedElement: () => void;
	deleteElement: (hierarchy: hierarchyType) => void;
};
export const ElementsContext = createContext({} as ElementsContextType);
export const useElementsContext = () => useContext(ElementsContext);
export default function ElementsProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [elements, setElements] = useState<ElementType[]>([]);
	const [ids, setIds] = useState([] as string[]);
	const [selectedElementHierarchy, setSelectedElementHierarchy] =
		useState<hierarchyType>([]);
	const uuid = ({ key }: { key: string }) => {
		const randomString = "xxxxxxxx".replace(/[xy]/g, function (c) {
			var r = (Math.random() * 16) | 0,
				v = c == "x" ? r : (r & 0x3) | 0x8;
			return v.toString(16);
		});
		const id = `${key}_${randomString}`;
		if (ids.includes(id)) {
			return uuid({ key });
		}
		setIds((prev) => [...prev, id]);
		return id;
	};

	const traverse = ({
		elements,
		hierarchy,
		item,
		assign = false,
		returnValue = false,
		returnElement,
		remove = false,
		insert = false,
	}: {
		elements: ElementType[];
		hierarchy: hierarchyType;
		item: ElementType;
		assign?: boolean;
		returnValue?: boolean;
		returnElement?: { item: ElementType };
		remove?: boolean;
		insert?: boolean;
	}) => {
		if (remove && hierarchy.length == 2) {
			console.log("remove", hierarchy[0]);
			setIds((prev) => prev.filter((id) => id !== hierarchy[0]));
			elements.forEach((element) => {
				if (element.id == hierarchy[1]) {
					element.children = element.children?.filter(
						(child) => child.id !== hierarchy[0]
					);
				}
			});
			return;
		}
		const topParent = hierarchy.pop();

		elements.forEach((element, index) => {
			if (element.id == topParent) {
				if (hierarchy.length == 0) {
					if (returnValue && returnElement) {
						returnElement.item = element;
						return;
					}
					if (assign) {
						elements[index] = item;
						return;
					}
					if (insert) {
						const children = _.cloneDeep(element.children || []);
						const id = uuid({
							key: item.componentKey,
						});
						const newHierarchy = [id, ...element.hierarchy];
						children.push({
							...item,
							hierarchy: newHierarchy,
							id,
						});
						element.children = children;
					}
				} else {
					if (element.children != undefined)
						traverse({
							elements: element.children,
							hierarchy,
							item,
							assign,
							returnElement,
							returnValue,
							insert,
							remove,
						});
				}
			}
		});
	};

	const addElement = ({
		item,
		hierarchy,
		position = "bottom",
	}: AddElementArgs) => {
		setElements((prev) => {
			const id = uuid({
				key: item.componentKey,
			});
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
					insert: true,
				});
			} else {
				const element = { ...newElement, hierarchy: [id] };
				if (position == "bottom") newElements.push(element);
				else {
					let updatedElements = [element, ...newElements];
					return updatedElements;
				}
			}
			return [...newElements];
		});
	};
	const reset = () => {
		setElements([]);
	};
	const selectElement = (hierarchy: hierarchyType) => {
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
	const deleteElement = (hierarchy: hierarchyType) => {
		if (hierarchy.length > 1) {
			let newElements = _.cloneDeep(elements);
			traverse({
				elements: newElements,
				hierarchy,
				item: {} as ElementType,
				remove: true,
			});
			console.log(newElements);
			setElements(newElements);
		} else {
			setIds((prev) => prev.filter((id) => id !== hierarchy.join("")));
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
