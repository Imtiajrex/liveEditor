import { createStyles } from "@mantine/core";
import { useState } from "react";
import CompileButton from "../compilers/CompileButton";
import CompileSidebar from "../compilers/CompileSidebar";

const useStyles = createStyles((theme) => ({}));
export default function Compile() {
	const { classes } = useStyles();
	const [isOpen, setOpen] = useState(false);
	const toggle = () => {
		setOpen(true);
	};
	return (
		<div>
			<CompileButton onClick={toggle} />
			<CompileSidebar isOpen={isOpen} setOpen={setOpen} />
		</div>
	);
}
