import {
	Button,
	Flex,
	FormControl,
	FormLabel,
	Heading,
	Input,
	Stack,
	useColorModeValue,
	Avatar,
	Center,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { auth, storage } from "../../firebase/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useAuthState } from "react-firebase-hooks/auth";
import { updateProfile } from "firebase/auth";

// TODO => raporda 3.2
export default function EditProfilePage() {
	const [user] = useAuthState(auth);
	const [fullName, setFullName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const [profilePic, setProfilePic] = useState("");

	const [previewImage, setPreviewImage] = useState("");

	const fileRef = useRef();

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		const reader = new FileReader();
		reader.onloadend = () => {
			setProfilePic(file);
			setPreviewImage(reader.result);
		};
		reader.readAsDataURL(file);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const storageRef = ref(storage, `users/${user.uid}/profilePic`);

		await uploadBytes(storageRef, profilePic);
		const url = await getDownloadURL(storageRef);

		await updateProfile(auth.currentUser, {
			photoURL: url,
		});
	};

	return (
		<Flex align={"center"} justify={"center"}>
			<Stack
				spacing={4}
				w={"full"}
				maxW={"md"}
				bg={useColorModeValue("white", "gray.700")}
				rounded={"xl"}
				boxShadow={"lg"}
				p={6}
				my={12}
			>
				<Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
					User Profile Edit
				</Heading>
				<form onSubmit={handleSubmit}>
					<FormControl id='avatar'>
						<FormLabel>User Icon</FormLabel>
						<Stack direction={["column", "row"]} spacing={6}>
							<Center>
								<Avatar size='xl' src={previewImage || user.photoURL}></Avatar>
							</Center>
							<Center w='full'>
								<Button w='full' onClick={() => fileRef.current.click()}>
									Change Avatar
								</Button>
								<Input type='file' hidden ref={fileRef} accept='image/*' onChange={handleFileChange} />
							</Center>
						</Stack>
					</FormControl>
					<FormControl id='userName' isRequired>
						<FormLabel>User name</FormLabel>
						<Input placeholder='Username' _placeholder={{ color: "gray.500" }} type='text' />
					</FormControl>
					<FormControl id='email' isRequired>
						<FormLabel>Email address</FormLabel>
						<Input placeholder='your-email@example.com' _placeholder={{ color: "gray.500" }} type='email' />
					</FormControl>
					<FormControl id='password' isRequired>
						<FormLabel>Password</FormLabel>
						<Input placeholder='password' _placeholder={{ color: "gray.500" }} type='password' />
					</FormControl>

					<Stack mt={4} spacing={6} direction={["column", "row"]}>
						<Button
							bg={"red.400"}
							color={"white"}
							w='full'
							_hover={{
								bg: "red.500",
							}}
						>
							Cancel
						</Button>
						<Button
							type='submit'
							bg={"blue.400"}
							color={"white"}
							w='full'
							_hover={{
								bg: "blue.500",
							}}
						>
							Submit
						</Button>
					</Stack>
				</form>
			</Stack>
		</Flex>
	);
}
