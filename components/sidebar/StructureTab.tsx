import { ElementsContext } from "../../contexts/ElementsProvider";
import { useContext } from "react";

export default function StructureTab() {
	const { getSelectedElement, updateSelectedElement } =
		useContext(ElementsContext);

	return <div></div>;
}
