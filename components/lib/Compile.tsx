import { createStyles } from "@mantine/core";
import CompileButton from "../compilers/CompileButton";

const useStyles = createStyles((theme) => ({
	container: {
		position: "fixed",
		top: "30%",
		right: 20,
		zIndex: 999,
	},
}));
export default function Compile() {
	const { classes } = useStyles();
	return (
		<div className={classes.container}>
			<CompileButton />
		</div>
	);
}
