import { useContext, useState } from "react";
import { useDrop } from "react-dnd";
import { ElementsContext } from "../../contexts/ElementsProvider";
import { ItemType } from "../../types/elements";
import { dropFunc, ElementComponentType } from "../Playground";
import styles from "styles/elements/Box.module.scss";
export default function Box({ children, hierarchy }: ElementComponentType) {
	const { addElement } = useContext(ElementsContext);
	const [{ isOverCurrent }, drop] = useDrop(
		dropFunc(({ item }: { item: ItemType }) =>
			addElement({ item: item, hierarchy })
		)
	);
	const [over, setover] = useState(false);
	const toggleHover = (e) => {
		e.stopPropagation();
		setover(!over);
	};
	const handleClick = (e) => {
		e.stopPropagation();
		console.log("click");
	};
	return (
		<div
			className={` ${styles.container} ${
				children ? styles.parentBox : styles.box
			} ${isOverCurrent ? styles.over : ""} ${over ? styles.hover : ""}`}
			ref={drop}
			onMouseOver={toggleHover}
			onMouseOut={toggleHover}
			onClick={handleClick}
		>
			<div>{children}</div>
		</div>
	);
}
