import React from "react";
import NavigatorToggleButton from "./NavigatorToggleButton";
import { useState } from "react";
import Navigator from "./Navigator";
export default function Navigation() {
	const [isOpen, setOpen] = useState(false);
	return (
		<>
			<NavigatorToggleButton
				onClick={() => {
					setOpen(true);
				}}
			/>
			<Navigator {...{ isOpen, setOpen }} />
		</>
	);
}
