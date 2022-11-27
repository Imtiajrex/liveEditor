import { IconBox, TablerIcon } from "@tabler/icons";
import React, { useContext, useEffect, useMemo } from "react";
import { useDrag } from "react-dnd";
import { ItemType } from "../types/elements";
import Box from "./elements/Box";

const Item = (itemProps: ItemType) => {
	const { title, Icon, id } = itemProps;
	const [{ isDragging, didDrop }, drag] = useDrag(() => ({
		type: "Element",
		item: itemProps,
		collect: (monitor) => {
			return {
				isDragging: monitor.isDragging(),
				didDrop: monitor.didDrop(),
			};
		},
	}));

	return (
		<div className="item" ref={drag}>
			<Icon size={35} />
			<span>{title}</span>
		</div>
	);
};
const items = [
	{ title: "Box", Icon: IconBox, id: 1, Component: Box },
] as ItemType[];

export default function Sidebar() {
	const renderItems = useMemo(
		() =>
			items.map((item, index) => {
				return <Item {...item} key={index} />;
			}),
		[]
	);
	return (
		<div className="sidebar">
			<div className="item">{renderItems}</div>
		</div>
	);
}
