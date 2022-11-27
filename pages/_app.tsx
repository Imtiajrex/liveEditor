import { AppProps } from "next/app";
import { MantineProvider } from "@mantine/core";
import "styles/globals.css";
export default function App(props: AppProps) {
	const { Component, pageProps } = props;
	return (
		<MantineProvider withGlobalStyles withNormalizeCSS>
			<Component {...pageProps} />
		</MantineProvider>
	);
}
