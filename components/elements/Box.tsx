import { useContext, useMemo, useState } from "react";
import { useDrop } from "react-dnd";
import { ElementsContext, ElementType } from "../../contexts/ElementsProvider";
import { dropFunc, ElementComponentType } from "../Playground";
import styles from "styles/elements/Box.module.scss";
export default function Box({
	children,
	hierarchy,
	style,
	content,
}: ElementComponentType) {
	const { addElement, selectElement, selectedElementHierarchy } =
		useContext(ElementsContext);
	const [{ isOverCurrent }, drop] = useDrop(
		dropFunc(({ item }: { item: ElementType }) =>
			addElement({ item: item, hierarchy })
		)
	);
	const [over, setover] = useState(false);
	const onHover = (e) => {
		e.stopPropagation();
		setover(true);
	};
	const onOut = (e) => {
		e.stopPropagation();
		setover(false);
	};
	const handleClick = (e) => {
		e.stopPropagation();
		selectElement(hierarchy);
	};
	const active = useMemo(
		() =>
			hierarchy.length === selectedElementHierarchy.length &&
			hierarchy.every(
				(value, index) => value === selectedElementHierarchy[index]
			),
		[hierarchy, selectedElementHierarchy]
	);
	const elementsStyleObject = `${
		((!children && !content) || (content && content.length == 0)) && styles.box
	} ${isOverCurrent ? styles.over : ""} ${over || active ? styles.hover : ""}`;
	return (
		<div
			className={`${elementsStyleObject}`}
			style={style}
			ref={drop}
			onMouseOver={onHover}
			onMouseOut={onOut}
			onClick={handleClick}
		>
			{content}
			{children}
		</div>
	);
}
