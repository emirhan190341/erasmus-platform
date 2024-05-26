import { Button, Image } from "@chakra-ui/react";
import { Container, Stack, Flex, Heading, Text } from "@chakra-ui/react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import { auth } from "../firebase/firebase";

const HomePage = () => {
	const [authUser] = useAuthState(auth);

	return (
		<Container maxW={"7xl"}>
			<Stack textAlign={"center"} align={"center"} spacing={{ base: 8, md: 10 }} py={{ base: 20, md: 28 }}>
				<Heading fontWeight={600} fontSize={{ base: "40px", md: "60px" }} lineHeight={"110%"}>
					<Text
						as='span'
						bgGradient='linear(to-r, #13b3d0, #165dc9)'
						bgClip='text'
						textTransform={"uppercase"}
					>
						Erasmus
					</Text>
					<Text as={"span"}> Made Easy</Text>
				</Heading>
				<Text fontSize={"lg"} fontWeight={"400"} maxW={"3xl"}>
					Learn from other students who have already been on Erasmus. Get tips and tricks to make your Erasmus
					experience unforgettable.
				</Text>
				<Flex
					gap={6}
					flexDir={{
						base: "column",
						md: "row",
					}}
				>
					{authUser && (
						<>
							<Link to='/experiences'>
								<Button rounded={"full"} px={6} bg={"blue.400"} _hover={{ bg: "blue.500" }}>
									See Experiences
								</Button>
							</Link>
							<Link to='/create'>
								<Button rounded={"full"} px={6}>
									Ask a Question
								</Button>
							</Link>
						</>
					)}
					{!authUser && (
						<>
							<Link to='/login'>
								<Button rounded={"full"} px={6} bg={"blue.400"} _hover={{ bg: "blue.500" }}>
									Sign Up for Free
								</Button>
							</Link>
							<Link to='/login'>
								<Button rounded={"full"} px={6}>
									Login to Account
								</Button>
							</Link>
						</>
					)}
				</Flex>
				<Flex w={"full"} justifyContent={"center"}>
					<Image src='/hero.svg' alt='hero' />
				</Flex>
			</Stack>
		</Container>
	);
};
export default HomePage;
