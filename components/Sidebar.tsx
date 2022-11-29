import {
	IconAtom2,
	IconBox,
	IconBrandCss3,
	IconListDetails,
} from "@tabler/icons";
import React, { useContext, useMemo } from "react";
import { useDrag } from "react-dnd";
import { ItemType } from "../types/elements";
import Box from "./elements/Box";
import styles from "styles/Sidebar.module.scss";
import { ElementsContext, ElementType } from "../contexts/ElementsProvider";
import { createStyles, Tabs, Text, UnstyledButton } from "@mantine/core";
import StructureTab from "./sidebar/StructureTab";
import StyleTab from "./sidebar/StyleTab";
import AdvancedTab from "./sidebar/AdvancedTab";

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
		maxWidth: 362,
		width: "100%",
		backgroundColor: theme.colors.gray[0],
		height: "100%",
		position: "fixed",
		borderRight: `2px solid ${theme.colors.gray[2]}`,
		transition: "0.2s",
		overflow: "hidden",
	},
	collapsed: {
		maxWidth: "270px!important",
	},
}));

const Item = (itemProps: ElementType) => {
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
const items = [
	{
		title: "Box",
		Icon: IconBox,
		Component: Box,
		style: {
			padding: "20px",
		},
	},
] as ElementType[];

export default function Sidebar() {
	const { selectedElementHierarchy } = useContext(ElementsContext);
	const { classes } = useStyles();
	return (
		<div
			className={`${classes.sideBar} ${
				selectedElementHierarchy.length == 0 && classes.collapsed
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
	const { selectedElementHierarchy } = useContext(ElementsContext);

	const [activeTab, setActiveTab] = React.useState<string | null>("elements");
	React.useEffect(() => {
		if (selectedElementHierarchy.length == 0) {
			setActiveTab("elements");
		}
	}, [selectedElementHierarchy]);
	return (
		<Tabs
			styles={(theme) => ({
				tab: {
					padding: theme.spacing.md,
				},
			})}
			defaultValue={"elements"}
			value={activeTab}
			onTabChange={setActiveTab}
		>
			<Tabs.List>
				<Tabs.Tab value="elements" icon={<IconBox size={16} />}>
					{selectedElementHierarchy.length == 0 ? "Elements" : ""}
				</Tabs.Tab>
				<Tabs.Tab
					value="structure"
					icon={<IconListDetails size={16} />}
					disabled={selectedElementHierarchy.length == 0}
				>
					{selectedElementHierarchy.length == 0 ? "" : "Structure"}
				</Tabs.Tab>
				<Tabs.Tab
					value="style"
					icon={<IconBrandCss3 size={16} />}
					disabled={selectedElementHierarchy.length == 0}
				>
					{selectedElementHierarchy.length == 0 ? "" : "Style"}
				</Tabs.Tab>
				<Tabs.Tab
					value="advanced"
					icon={<IconAtom2 size={16} />}
					disabled={selectedElementHierarchy.length == 0}
				>
					{selectedElementHierarchy.length == 0 ? "" : "Advanced"}
				</Tabs.Tab>
			</Tabs.List>
			<Tabs.Panel value="elements">
				<Elements />
			</Tabs.Panel>
			<Tabs.Panel value="structure">
				<StructureTab />
			</Tabs.Panel>
			<Tabs.Panel value="style">
				<StyleTab />
			</Tabs.Panel>
			<Tabs.Panel value="advanced">
				<AdvancedTab />
			</Tabs.Panel>
		</Tabs>
	);
};
