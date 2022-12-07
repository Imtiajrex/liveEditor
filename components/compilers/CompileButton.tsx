import { ActionIcon, createStyles, Text } from "@mantine/core";
import { IconCloudComputing } from "@tabler/icons";

const useStyles = createStyles((theme) => ({
	container: {},
	button: {
		position: "fixed",
		top: "30%",
		right: 20,
		zIndex: 999,
	},
}));
export default function CompileButton({ onClick }: { onClick: () => void }) {
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
				<IconCloudComputing size={23} />
			</ActionIcon>
		</div>
	);
}
