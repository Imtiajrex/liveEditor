import { ActionIcon, createStyles, Text } from "@mantine/core";
import {
	IconArrowDown,
	IconChevronDown,
	IconChevronRight,
} from "@tabler/icons";
import { MouseEventHandler, useState } from "react";
import { useElementsContext } from "../../contexts/ElementsProvider";
import { ElementType } from "../../types/elements";
const useStyles = createStyles((theme) => ({
	container: {
		position: "fixed",
		top: "35%",
		right: "-50%",
		backgroundColor: theme.colors.gray[0],
		zIndex: 950,
		padding: 20,
		width: 225,
		borderRadius: 10,
		transition: "0.2s ease-in-out",
	},
	open: {
		right: "20px!important",
	},
	element: {
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
		padding: "5px 10px",
		margin: "5px 0",
		transition: "0.2s ease-in-out",
		cursor: "pointer",
		borderRadius: 8,
		["&:hover"]: {
			background: theme.colors.cyan[2],
		},
	},
	level1: {
		background: theme.colors.gray[1],
	},
	level2: {
		background: theme.colors.gray[2],
	},
	level3: {
		background: theme.colors.gray[3],
	},
	level4: {
		background: theme.colors.gray[4],
	},
	level5: {
		background: theme.colors.gray[5],
	},
	selected: {
		background: theme.colors.cyan[1] + "!important",
		["&:hover"]: {
			background: theme.colors.cyan[2],
		},
	},
	icon: {
		position: "absolute",
		top: 2.5,
		right: 2.5,
	},
	elementContainer: {
		position: "relative",
	},
	gap: {
		margin: "5px 0",
		background: theme.colors.dark[9],
		padding: "5px",
		borderRadius: 8,
	},
	titleContainer: {
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
	},
}));
export default function Navigator({
	isOpen,
	setOpen,
}: {
	isOpen: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	const { classes } = useStyles();
	const { elements } = useElementsContext();
	const toggleOpen = () => setOpen(false);
	return (
		<div className={`${classes.container} ${isOpen && classes.open}`}>
			<div className={classes.titleContainer}>
				<Text size="md" weight={"bold"}>
					Navigator
				</Text>
				<ActionIcon color={"dark.8"} onClick={toggleOpen}>
					<IconChevronRight size={15} />
				</ActionIcon>
			</div>
			<Elements elements={elements} />
		</div>
	);
}
const Elements = ({ elements }: { elements: ElementType[] }) => {
	const { classes } = useStyles();
	const { selectElement } = useElementsContext();
	const [collapsed, setCollapsed] = useState(elements.map(() => false));
	const updateCollapsed = (index: number) => {
		setCollapsed((prev) => {
			const newCollapsed = [...prev];
			newCollapsed[index] = !newCollapsed[index];
			return newCollapsed;
		});
	};
	return (
		<div>
			{elements.map((element, index) => {
				return (
					<div
						className={`${elements[0].hierarchy.length == 1 && classes.gap}`}
						key={element.id}
					>
						<div className={classes.elementContainer}>
							<NavigatorElement
								key={element.id}
								title={element.title}
								hierarchy={element.hierarchy}
								onClick={selectElement}
							/>
							{element.children && (
								<ActionIcon
									className={classes.icon}
									onClick={() => {
										updateCollapsed(index);
									}}
								>
									<IconChevronDown size={15} />
								</ActionIcon>
							)}
						</div>
						{element.children && collapsed[index] && (
							<Elements elements={element.children} />
						)}
					</div>
				);
			})}
		</div>
	);
};
const NavigatorElement = ({
	title,
	onClick,
	hierarchy,
}: {
	hierarchy: number[];
	title: string;
	onClick: (hierarchy: number[]) => void;
}) => {
	const { classes } = useStyles();
	const { selectedElementHierarchy } = useElementsContext();
	const selected = selectedElementHierarchy.join("") === hierarchy.join("");
	console.log(selected, selectedElementHierarchy, hierarchy);
	return (
		<div
			className={`${classes.element} ${
				classes[`level${Math.min(hierarchy.length, 5)}`]
			} ${selected && classes.selected}`}
			style={{
				marginLeft: (hierarchy.length - 1) * 5,
			}}
			onClick={() => {
				onClick(hierarchy);
			}}
		>
			<Text size="sm" weight={"bold"}>
				{title}
			</Text>
		</div>
	);
};
