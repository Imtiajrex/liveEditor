import { createStyles } from "@mantine/core";
import { Text, Button, TextInput } from "@mantine/core";
import {
	IconBrandHtml5,
	IconBrandSvelte,
	IconDownload,
	IconJumpRope,
} from "@tabler/icons";
import { useState } from "react";
import { useElementsContext } from "../../contexts/ElementsProvider";
import { compile } from "../../lib/compile";
import { saveAs } from "file-saver";
const useStyles = createStyles((theme) => ({
	sideBar: {
		maxWidth: 250,
		width: "100%",
		backgroundColor: theme.colors.gray[0],
		height: "100%",
		position: "fixed",
		zIndex: 999,
		top: 0,
		right: 0,
		borderLeft: `2px solid ${theme.colors.gray[2]}`,
		transition: "0.2s ease-in-out",
		overflow: "hidden",
		padding: 20,
	},
	hidden: {
		right: `-250px !important`,
	},
	compilers: {
		marginTop: 40,
	},
}));
export default function CompileSidebar({ isOpen, setOpen }) {
	const { classes } = useStyles();
	const { elements } = useElementsContext();
	const [fileName, setfileName] = useState("");

	const compileAndDownload = (extension: "html" | "svelte") => {
		const html = compile(elements);
		const file = new Blob([html], { type: "text/plain" });
		saveAs(file, `${fileName.length > 0 ? fileName : "index"}.${extension}`);
	};
	return (
		<div className={`${classes.sideBar} ${!isOpen && classes.hidden}`}>
			<Text size={"lg"} weight="bold">
				Compile
			</Text>
			<div className={classes.compilers}>
				<TextInput
					label="File Name"
					placeholder="Home"
					onChange={(e) => setfileName(e.target.value)}
				/>
				<Button
					leftIcon={<IconBrandHtml5 />}
					variant="light"
					onClick={() => compileAndDownload("html")}
					fullWidth
					color={"cyan.8"}
					my="lg"
				>
					Download as HTML
				</Button>
				<Button
					leftIcon={<IconBrandSvelte />}
					variant="light"
					onClick={() => compileAndDownload("svelte")}
					fullWidth
					color={"cyan.8"}
					my="lg"
				>
					Download as Svelte
				</Button>
			</div>
		</div>
	);
}
