import { IconBox, TablerIcon } from "@tabler/icons";
import Box from "../components/elements/Box";

export type AddElementArgs = {
	item: ElementType;
	hierarchy?: hierarchyType;
	position?: "top" | "bottom";
};
export type AddElementFunctionType = (element: AddElementArgs) => void;

export type ElementType = {
	title: string;
	Icon: TablerIcon;
	Component?: React.ElementType;
	componentKey: string;
	children?: ElementType[];
	hierarchy: hierarchyType;
	id: string;
	style?: React.CSSProperties;
	content?: string;
};

export type hierarchyType = string[];
export const elements = [
	{
		title: "Container",
		Icon: IconBox,
		componentKey: "container",
		style: {
			padding: 20,
		},
	},
] as ElementType[];

export const componentMap = {
	container: Box,
};
