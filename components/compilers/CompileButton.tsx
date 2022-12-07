import { ActionIcon, createStyles, Text } from "@mantine/core";
import { IconCloudComputing } from "@tabler/icons";
import { useContext } from "react";
import { ElementsContext } from "../../contexts/ElementsProvider";
import { compile } from "../../lib/compile";
import { elements } from "../../types/elements";

const useStyles = createStyles((theme) => ({
	container: {},
	button: {
		padding: `20px 10px`,
	},
}));
export default function CompileButton() {
	const { classes } = useStyles();
	const { elements } = useContext(ElementsContext);
	const handleClick = (e) => {
		compile(elements);
	};
	return (
		<div className={classes.container}>
			<ActionIcon
				variant="outline"
				color={"cyan.8"}
				size="lg"
				title="Compile"
				aria-label="Compile"
				onClick={handleClick}
			>
				<IconCloudComputing size={23} />
			</ActionIcon>
		</div>
	);
}
