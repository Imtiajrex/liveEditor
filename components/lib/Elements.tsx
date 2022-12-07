import { useMemo } from "react";

import styles from "styles/Sidebar.module.scss";
import Element from "./Element";
import { elements } from "../../types/elements";

export default function Elements() {
	const renderItems = useMemo(
		() =>
			elements.map((item, index) => {
				return <Element {...item} key={index} />;
			}),
		[]
	);
	return <div className={styles.items}>{renderItems}</div>;
}
