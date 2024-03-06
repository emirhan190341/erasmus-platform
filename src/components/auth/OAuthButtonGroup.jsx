import { Button, ButtonGroup, VisuallyHidden } from "@chakra-ui/react";
import { GitHubIcon, GoogleIcon, TwitterIcon } from "../ProviderIcons";

const providers = [
	{ name: "Google", icon: <GoogleIcon /> },
	// { name: "Twitter", icon: <TwitterIcon /> },
	// { name: "GitHub", icon: <GitHubIcon /> },
];

export const OAuthButtonGroup = () => (
	<Button border='1px solid' _hover>
		<VisuallyHidden>Sign in with {name}</VisuallyHidden>
		<GoogleIcon />
	</Button>
);
