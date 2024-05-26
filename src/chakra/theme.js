import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

const config = {
	initialColorMode: "dark",
	useSystemColorMode: true,
};

// 3. extend the theme
const theme = extendTheme({
	config,
	styles: {
		global: (props) => ({
			body: {
				backgroundColor: mode("gray.300", "gray.800")(props),
			},
		}),
	},
});

export default theme;
