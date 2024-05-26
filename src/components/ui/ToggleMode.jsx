import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { Button, useColorMode } from "@chakra-ui/react";

export default function ToggleMode() {
	const { colorMode, toggleColorMode } = useColorMode();
	return (
		<header>
			<Button onClick={toggleColorMode}>{colorMode === "light" ? <SunIcon /> : <MoonIcon />}</Button>
		</header>
	);
}
