import { ElementType } from "../types/elements";
import reactToCSS from "react-style-object-to-css";
export const compile = (elements: ElementType[]) => {
	console.log(createHTMLFromElements(elements));
};

const createHTMLFromElements = (elements: ElementType[]) => {
	let source = "";
	elements.forEach((element, index) => {
		const style = reactToCSS(element.style);
		const component = elementsComponentMap[element.componentKey];
		source += `<${component} style="${style}">`;
		if (element.content && element.content.length > 0)
			source += element.content;
		if (element.children && element.children.length > 0)
			source += createHTMLFromElements(element.children);
		source += `</${component}>`;
	});
	return source;
};

const elementsComponentMap = {
	container: "div",
};
