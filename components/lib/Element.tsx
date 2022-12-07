import { createStyles, Text, UnstyledButton } from "@mantine/core";
import { useDrag } from "react-dnd";
import { ElementType } from "../../types/elements";

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
}));
export default function Element(itemProps: ElementType) {
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
}
