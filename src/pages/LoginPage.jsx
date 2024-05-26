import { Button, Flex, Link, FormControl, FormLabel, Heading, Input, Stack, Image, Container } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import ForgotPassword from "../components/modals/ForgotPassword";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "../firebase/firebase";
import { useState } from "react";
import GoogleSignIn from "../components/auth/GoogleSignIn";

const LoginPage = () => {
	const [signInWithEmailAndPassword, , loading] = useSignInWithEmailAndPassword(auth);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await signInWithEmailAndPassword(email, password);
		} catch (err) {
			alert(err.message);
		}
	};

	return (
		<Container maxW={"1200px"} minH={"80vh"} display='flex' alignItems='center'>
			<Stack
				w='full'
				direction={{ base: "column", md: "row" }}
				alignItems='center'
				border='1px solid gray'
				borderRadius='lg'
				overflow='hidden'
			>
				<Flex p={8} flex={1} align={"center"} justify={"center"}>
					<Stack spacing={4} w={"full"} maxW={"md"}>
						<Heading fontSize={"2xl"}>Login to your account</Heading>
						<form onSubmit={handleSubmit}>
							{/* EMAIL ADDRESS */}
							<FormControl id='email'>
								<FormLabel>Email address</FormLabel>
								<Input type='email' value={email} onChange={(e) => setEmail(e.target.value)} />
							</FormControl>

							{/* PASSWORD  */}
							<FormControl id='password'>
								<FormLabel>Password</FormLabel>
								<Input type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
							</FormControl>
							<Stack spacing={4}>
								<Stack
									direction={{ base: "column", sm: "row" }}
									align={"start"}
									justify={"space-between"}
									mt={2}
								>
									<Link as={RouterLink} to='/signup' color={"blue.500"}>
										{"Don't"} have an account?
									</Link>
									<ForgotPassword />
								</Stack>
								<GoogleSignIn />
								<Button colorScheme={"blue"} variant={"solid"} type='submit' isLoading={loading}>
									Login
								</Button>
							</Stack>
						</form>
					</Stack>
				</Flex>
				<Flex flex={1} height={400} display={{ base: "none", md: "flex" }}>
					<Image
						alt={"Login Image"}
						objectFit={"cover"}
						src={
							"https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80"
						}
					/>
				</Flex>
			</Stack>
		</Container>
	);
};
export default LoginPage;
