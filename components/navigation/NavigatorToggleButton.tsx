import { ActionIcon, createStyles, Text } from "@mantine/core";
import { IconHierarchy } from "@tabler/icons";

const useStyles = createStyles((theme) => ({
	container: {},
	button: {
		position: "fixed",
		top: "40%",
		right: 20,
		zIndex: 950,
	},
}));
export default function NavigatorToggleButton({
	onClick,
}: {
	onClick: () => void;
}) {
	const { classes } = useStyles();
	return (
		<div className={classes.container}>
			<ActionIcon
				variant="outline"
				color={"cyan.8"}
				size="lg"
				title="Compile"
				aria-label="Compile"
				onClick={onClick}
				className={classes.button}
			>
				<IconHierarchy size={23} />
			</ActionIcon>
		</div>
	);
}
