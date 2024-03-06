import {
	Button,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalOverlay,
	useDisclosure,
	Box,
	useToast,
} from "@chakra-ui/react";
import { FormControl, Flex, Heading, Input, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import { useSendPasswordResetEmail } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/firebase";
import { useState } from "react";

const ForgotPassword = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [sendPasswordResetEmail, sending, error] = useSendPasswordResetEmail(auth);
	const [email, setEmail] = useState("");
	const toast = useToast();

	const handleResetPassword = async () => {
		const success = await sendPasswordResetEmail(email);
		if (success) {
			toast({
				title: "Email sent",
				description: `We've sent a password reset link to ${email}`,
				isClosable: true,
				duration: 3000,
				status: "success",
			});
		} else {
			toast({
				title: "Error",
				description: `Something went wrong.`,
				isClosable: true,
				duration: 3000,
				status: "error",
			});
		}
	};

	return (
		<>
			<Box
				onClick={onOpen}
				color='blue.500'
				bg='transparent'
				_hover={{ textDecoration: "underline", cursor: "pointer" }}
			>
				Forgot password
			</Box>
			<Modal onClose={onClose} isOpen={isOpen} isCentered>
				<ModalOverlay />
				<ModalContent>
					<ModalCloseButton />
					<ModalBody>
						<Flex align={"center"} justify={"center"}>
							<Stack
								spacing={4}
								w={"full"}
								maxW={"md"}
								bg={useColorModeValue("white", "gray.700")}
								rounded={"xl"}
								p={6}
								my={12}
							>
								<Heading lineHeight={1.1} fontSize={{ base: "2xl", md: "3xl" }}>
									Forgot your password?
								</Heading>
								<Text
									fontSize={{ base: "sm", sm: "md" }}
									color={useColorModeValue("gray.800", "gray.400")}
								>
									You&apos;ll get an email with a reset link
								</Text>
								<FormControl id='email'>
									<Input
										placeholder='your-email@example.com'
										_placeholder={{ color: "gray.500" }}
										type='email'
										value={email}
										onChange={(e) => setEmail(e.target.value)}
									/>
								</FormControl>
								<Stack spacing={6}>
									<Button
										bg={"blue.400"}
										color={"white"}
										_hover={{
											bg: "blue.500",
										}}
										onClick={handleResetPassword}
										isLoading={sending}
									>
										Request Reset
									</Button>
								</Stack>
							</Stack>
						</Flex>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
};
export default ForgotPassword;
