import { useDrop } from "react-dnd";
import { AddElementFunctionType, dropFunc, HierarchyType } from "../Playground";
import { ItemType } from "../Sidebar";

export default function Box({
	children,
	addElement,
	index,
	hierarchy,
}: {
	children?: React.ReactNode;
	addElement: AddElementFunctionType;
	index: number;
	hierarchy?: HierarchyType;
}) {
	const [{ isOver, isOverCurrent }, drop] = useDrop(
		dropFunc(({ item }: { item: ItemType }) =>
			addElement({ item: item, hierarchy })
		)
	);
	return (
		<div
			className={`${children ? "parentBox" : "box"}`}
			style={{
				backgroundColor: isOverCurrent ? "red" : "transparent",
			}}
			ref={drop}
		>
			{children}
		</div>
	);
}
