import {
	IconAtom2,
	IconBox,
	IconBrandCss3,
	IconListDetails,
	TablerIcon,
} from "@tabler/icons";
import React, { useContext, useEffect, useMemo } from "react";
import { useDrag } from "react-dnd";
import { ItemType } from "../types/elements";
import Box from "./elements/Box";
import styles from "styles/Sidebar.module.scss";
import { ElementsContext } from "../contexts/ElementsProvider";
import { createStyles, Tabs, Text, UnstyledButton } from "@mantine/core";
import { IconPhoto, IconMessageCircle, IconSettings } from "@tabler/icons";

const useStyles = createStyles((theme) => ({
	item: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		textAlign: "center",
		borderRadius: theme.radius.md,
		width: 90,
		height: 90,
		backgroundColor:
			theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
		transition: "box-shadow 150ms ease, transform 100ms ease",

		"&:hover": {
			boxShadow: `${theme.shadows.md} !important`,
			transform: "scale(1.05)",
		},
	},
	sideBar: {
		maxWidth: 346,
		width: "100%",
		backgroundColor: "#e6e6e6",
		height: "100%",
		position: "fixed",
		borderTopRightRadius: "25px",
		borderBottomRightRadius: "25px",
		transition: "0.2s",
		overflow: "hidden",
	},
	collapsed: {
		maxWidth: "270px!important",
	},
}));

const Item = (itemProps: ItemType) => {
	const { title, Icon } = itemProps;
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
	const { classes } = useStyles();

	return (
		<UnstyledButton
			key={title.toLowerCase()}
			className={classes.item}
			ref={drag}
		>
			<Icon size={32} />
			<Text size="xs" mt={7}>
				{title}
			</Text>
		</UnstyledButton>
	);
};
const items = [{ title: "Box", Icon: IconBox, Component: Box }] as ItemType[];

export default function Sidebar() {
	const { selectedElement } = useContext(ElementsContext);
	const { classes } = useStyles();
	return (
		<div
			className={`${classes.sideBar} ${
				selectedElement.length == 0 && classes.collapsed
			}`}
		>
			<ElementsTabs />
		</div>
	);
}
const Elements = () => {
	const renderItems = useMemo(
		() =>
			items.map((item, index) => {
				return <Item {...item} key={index} />;
			}),
		[]
	);
	return <div className={styles.items}>{renderItems}</div>;
};
const ElementsTabs = () => {
	const { selectedElement } = useContext(ElementsContext);
	return (
		<Tabs
			styles={(theme) => ({
				tab: {
					padding: theme.spacing.md,
				},
			})}
			defaultValue={"elements"}
		>
			<Tabs.List>
				<Tabs.Tab value="elements" icon={<IconBox size={16} />}>
					{selectedElement.length == 0 ? "Elements" : ""}
				</Tabs.Tab>
				<Tabs.Tab
					value="details"
					icon={<IconListDetails size={16} />}
					disabled={selectedElement.length == 0}
				>
					{selectedElement.length == 0 ? "" : "Details"}
				</Tabs.Tab>
				<Tabs.Tab
					value="styling"
					icon={<IconBrandCss3 size={16} />}
					disabled={selectedElement.length == 0}
				>
					{selectedElement.length == 0 ? "" : "Style"}
				</Tabs.Tab>
				<Tabs.Tab
					value="advanced"
					icon={<IconAtom2 size={16} />}
					disabled={selectedElement.length == 0}
				>
					{selectedElement.length == 0 ? "" : "Advanced"}
				</Tabs.Tab>
			</Tabs.List>
			<Tabs.Panel value="elements">
				<Elements />
			</Tabs.Panel>
		</Tabs>
	);
};
