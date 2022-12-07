import {
	IconAtom2,
	IconBox,
	IconBrandCss3,
	IconListDetails,
} from "@tabler/icons";
import React, { useContext } from "react";
import { createStyles, Tabs } from "@mantine/core";
import StructureTab from "./sidebar/StructureTab";
import StyleTab from "./sidebar/StyleTab";
import AdvancedTab from "./sidebar/AdvancedTab";
import Elements from "./lib/Elements";
import { useElementsContext } from "../contexts/ElementsProvider";

const useStyles = createStyles((theme) => ({
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

export default function Sidebar() {
	const { selectedElementHierarchy } = useElementsContext();
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
const ElementsTabs = () => {
	const { selectedElementHierarchy } = useElementsContext();

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
