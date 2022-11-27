import { TablerIcon } from "@tabler/icons";

export type AddElementArgs = {
	item: ItemType;
	hierarchy?: number[];
};
export type AddElementFunctionType = (element: AddElementArgs) => void;
export type ItemType = {
	title: string;
	Icon: TablerIcon;
	id: number;
	Component: React.ElementType;
};
