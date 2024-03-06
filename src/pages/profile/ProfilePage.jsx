import { Avatar } from "@chakra-ui/avatar";
import { Box, Container, Flex, Link, Text, VStack } from "@chakra-ui/layout";
import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/menu";
import { Portal } from "@chakra-ui/portal";
import { Button } from "@chakra-ui/react";
import { useAuthState } from "react-firebase-hooks/auth";
import { CgMoreO } from "react-icons/cg";
import { Link as RouterLink } from "react-router-dom";
import { auth } from "../../firebase/firebase";

const ProfilePage = () => {
	const [user] = useAuthState(auth);

	return (
		<Container maxW={"720px"} my={10} bg={"blackAlpha.700"} borderRadius={"lg"} p='10' boxShadow={"md"}>
			<VStack gap={4} alignItems={"start"} w={"full"}>
				<Flex justifyContent={"space-between"} w={"full"}>
					<Box>
						<Text fontSize={"2xl"} fontWeight={"bold"}>
							Emirhan Yıldırım
						</Text>
						<Flex gap={2} alignItems={"center"}>
							<Text fontSize={"sm"}>yildirimemirhan</Text>
						</Flex>
					</Box>
					<Box>
						<Avatar
							name={"dan"}
							src={"https://bit.ly/dan-abramov"}
							size={{
								base: "md",
								md: "xl",
							}}
						/>
					</Box>
				</Flex>

				<Text>Merhaba benim adım ejder</Text>

				<Link as={RouterLink} to={`/edit/${user.uid}`}>
					<Button size={"sm"}>Update Profile</Button>
				</Link>

				<Flex w={"full"} justifyContent={"space-between"}>
					<Flex gap={2} alignItems={"center"}>
						<Text color={"gray.light"}>212 followers</Text>
						<Box w='1' h='1' bg={"gray.light"} borderRadius={"full"}></Box>
					</Flex>
					<Flex>
						<Box className='icon-container'>
							<Menu>
								<MenuButton>
									<CgMoreO size={24} cursor={"pointer"} />
								</MenuButton>
								<Portal>
									<MenuList bg={"gray.dark"}>
										<MenuItem bg={"gray.dark"}>Copy link</MenuItem>
									</MenuList>
								</Portal>
							</Menu>
						</Box>
					</Flex>
				</Flex>
			</VStack>
		</Container>
	);
};
export default ProfilePage;
