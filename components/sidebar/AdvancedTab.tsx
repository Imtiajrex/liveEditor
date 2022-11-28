import { ElementsContext } from "../../contexts/ElementsProvider";
import { useContext } from "react";

export default function AdvancedTab() {
	const { getSelectedElement, updateSelectedElement } =
		useContext(ElementsContext);

	return <div></div>;
}
