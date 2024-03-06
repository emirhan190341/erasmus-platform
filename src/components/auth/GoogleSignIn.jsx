import { Button, Text, useToast } from "@chakra-ui/react";
import { GoogleIcon } from "../ProviderIcons";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/firebase";

const GoogleSignIn = () => {
	const [signInWithGoogle, user, loadingGoogleSignIn, errorGoogleSignIn] = useSignInWithGoogle(auth);
	const toast = useToast();

	const handleGoogleSignIn = async () => {
		try {
			await signInWithGoogle();
		} catch (err) {
			toast({
				title: "Oops!",
				description: err.message,
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		}
	};

	return (
		<Button
			display={"flex"}
			gap={2}
			border={"1px solid gray"}
			onClick={handleGoogleSignIn}
			isLoading={loadingGoogleSignIn}
		>
			<GoogleIcon />
			Continue with Google
			{errorGoogleSignIn && <Text color={"red.400"}>{errorGoogleSignIn.message}</Text>}
		</Button>
	);
};
export default GoogleSignIn;
