import { AppProps } from "next/app";
import { MantineProvider } from "@mantine/core";
import "styles/globals.css";

import { ModalsProvider } from "@mantine/modals";
import FileContentModal from "../components/modals/FileContentModal";
export default function App(props: AppProps) {
	const { Component, pageProps } = props;
	return (
		<MantineProvider withGlobalStyles withNormalizeCSS>
			<ModalsProvider
				modals={{
					filecontent: FileContentModal,
				}}
			>
				<Component {...pageProps} />
			</ModalsProvider>
		</MantineProvider>
	);
}
