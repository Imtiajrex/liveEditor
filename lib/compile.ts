import { ElementType } from "../types/elements";
import reactToCSS from "react-style-object-to-css";
export const compile = (elements: ElementType[]) => {
	const html = createHTMLFromElements(elements);
	const css = `\n<style>\n
	*{
		box-sizing: border-box;
		display:flex;
		width: 100%;
	}
	${createCSSFromElements(elements)}
	\n</style>`;
	console.log(html + css);
	return html + css;
};

const createCSSFromElements = (elements: ElementType[]) => {
	let source = "";
	elements.forEach((element) => {
		let style = reactToCSS(element.style);
		if (style) {
			source += `.${element.id}{\n\t\t`;
			style = style.replace(/;/g, ";\n\t\t");
			source += style;
			source += "\n\t}\n\t";
		}
		if (element.children && element.children.length > 0)
			source += `${createCSSFromElements(element.children)}`;
	});

	return source;
};
const createHTMLFromElements = (elements: ElementType[], childCount = 0) => {
	let source = "";

	elements.forEach((element, index) => {
		const component = elementsComponentMap[element.componentKey];
		//html creation
		source += "	".repeat(childCount);

		source += `<${component} class="${element.id}">`;
		source += `\n`;
		if (element.content && element.content.length > 0) {
			if (childCount > 0) source += "	".repeat(childCount);
			source += `	${element.content}\n`;
		}
		if (element.children && element.children.length > 0)
			source += `${createHTMLFromElements(element.children, childCount + 1)}`;

		source += "	".repeat(childCount);
		source += `</${component}>\n`;
	});
	return source;
};

const elementsComponentMap = {
	container: "div",
};
