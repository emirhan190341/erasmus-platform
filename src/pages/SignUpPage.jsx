import {
	Flex,
	Box,
	FormControl,
	FormLabel,
	Input,
	InputGroup,
	HStack,
	InputRightElement,
	Stack,
	Button,
	Heading,
	Text,
	useColorModeValue,
	Link,
	useToast,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth, firestore } from "../firebase/firebase";
import GoogleSignIn from "../components/auth/GoogleSignIn";
import { doc, setDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";

export default function SignUpPage() {
	const [showPassword, setShowPassword] = useState(false);
	const toast = useToast();

	const [fullName, setFullName] = useState("");
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const [createUserWithEmailAndPassword, _, loading, error] = useCreateUserWithEmailAndPassword(auth);

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await createUserWithEmailAndPassword(email, password);
			await setDoc(doc(firestore, "users", auth.currentUser.uid), {
				uid: auth.currentUser.uid,
				fullName,
				username,
				email,
				createdAt: new Date(),
				likedPosts: [],
				bookmarks: [],
			});
			await updateProfile(auth.currentUser, {
				displayName: fullName,
			});
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
		<Flex minH={"100vh"} align={"center"} justify={"center"} bg={useColorModeValue("gray.50", "gray.800")}>
			<Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
				<Stack align={"center"}>
					<Heading fontSize={"4xl"} textAlign={"center"}>
						Sign Up
					</Heading>
					<Text fontSize={"lg"} color={"gray.600"}>
						to Erasmus Platform
					</Text>
				</Stack>
				<Box rounded={"lg"} bg={useColorModeValue("white", "gray.700")} boxShadow={"lg"} p={8}>
					<form onSubmit={handleSubmit}>
						<Stack spacing={4}>
							<HStack>
								{/* FIRST NAME */}
								<Box>
									<FormControl id='fullName' isRequired>
										<FormLabel>Full Name</FormLabel>
										<Input
											type='text'
											value={fullName}
											onChange={(e) => setFullName(e.target.value)}
										/>
									</FormControl>
								</Box>

								{/* LAST NAME */}
								<Box>
									<FormControl id='username' isRequired>
										<FormLabel>Username</FormLabel>
										<Input
											type='text'
											value={username}
											onChange={(e) => setUsername(e.target.value)}
										/>
									</FormControl>
								</Box>
							</HStack>

							{/* EMAIL ADDRESS */}
							<FormControl id='email' isRequired>
								<FormLabel>Email address</FormLabel>
								<Input type='email' value={email} onChange={(e) => setEmail(e.target.value)} />
							</FormControl>

							{/* PASSWORD */}
							<FormControl id='password' isRequired>
								<FormLabel>Password</FormLabel>
								<InputGroup>
									<Input
										type={showPassword ? "text" : "password"}
										value={password}
										onChange={(e) => setPassword(e.target.value)}
									/>
									<InputRightElement h={"full"}>
										<Button
											variant={"ghost"}
											onClick={() => setShowPassword((showPassword) => !showPassword)}
										>
											{showPassword ? <ViewIcon /> : <ViewOffIcon />}
										</Button>
									</InputRightElement>
								</InputGroup>
							</FormControl>

							{/* STUDENT TYPE */}
							{/* <FormControl id='userType' isRequired>
								<FormLabel>Student Type</FormLabel>
								<RadioGroup defaultValue='2'>
									<Stack spacing={5} direction='row'>
										<Radio colorScheme='blue' value='1'>
											Local
										</Radio>
										<Radio colorScheme='blue' value='2'>
											Guest
										</Radio>
									</Stack>
								</RadioGroup>
							</FormControl> */}

							{/* ERROR */}
							{error && <Text color={"red.400"}>{error.message}</Text>}

							<Stack spacing={10} pt={2}>
								<Button
									loadingText='Submitting'
									size='lg'
									bg={"blue.400"}
									color={"white"}
									_hover={{
										bg: "blue.500",
									}}
									type='submit'
									isLoading={loading}
								>
									Sign up
								</Button>
							</Stack>

							<Stack>
								<GoogleSignIn />
								<Text align={"center"}>
									Already a user?{" "}
									<Link as={RouterLink} to='/login' color={"blue.400"}>
										Login
									</Link>
								</Text>
							</Stack>
						</Stack>
					</form>
				</Box>
			</Stack>
		</Flex>
	);
}
