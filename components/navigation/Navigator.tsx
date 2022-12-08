import { createStyles, Text } from "@mantine/core";
const useStyles = createStyles((theme) => ({
	container: {
		position: "fixed",
		top: "35%",
		right: "0",
		backgroundColor: theme.colors.gray[0],
		zIndex: 950,
		padding: 20,
		width: 225,
		borderRadius: 10,
	},
	open: {
		right: "20px!important",
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
	return (
		<div className={`${classes.container} ${isOpen && classes.open}`}>
			<Text size="md" weight={"bold"}>
				Navigator
			</Text>
		</div>
	);
}
