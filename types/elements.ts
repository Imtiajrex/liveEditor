import { TablerIcon } from "@tabler/icons";
import { ElementType } from "../contexts/ElementsProvider";

export type AddElementArgs = {
	item: ElementType;
	hierarchy?: number[];
};
export type AddElementFunctionType = (element: AddElementArgs) => void;
export type ItemType = {
	title: string;
	Icon: TablerIcon;
	Component: React.ElementType;
};
