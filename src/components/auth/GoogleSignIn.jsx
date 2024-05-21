import { Button, Text, useToast } from "@chakra-ui/react";
import { GoogleIcon } from "../ProviderIcons";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { auth, firestore } from "../../firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const GoogleSignIn = () => {
	const [signInWithGoogle, , loadingGoogleSignIn, errorGoogleSignIn] = useSignInWithGoogle(auth);
	const toast = useToast();

	const handleGoogleSignIn = async () => {
		try {
			const newUser = await signInWithGoogle();
			if (!newUser && errorGoogleSignIn) {
				alert(errorGoogleSignIn.message);
				return;
			}
			const userRef = doc(firestore, "users", newUser.user.uid);
			const userSnap = await getDoc(userRef);
			if (!userSnap.exists()) {
				// signup
				const userDoc = {
					uid: newUser.user.uid,
					email: newUser.user.email,
					username: newUser.user.email.split("@")[0],
					fullName: newUser.user.displayName,
					bio: "",
					profilePicURL: newUser.user.photoURL,
					likedPosts: [],
					bookmarks: [],
					followers: [],
					following: [],
					posts: [],
					createdAt: Date.now(),
				};
				await setDoc(doc(firestore, "users", newUser.user.uid), userDoc);
			}
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
