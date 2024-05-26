import { Avatar } from "@chakra-ui/avatar";
import { Box, Container, Flex, Link, Text, VStack } from "@chakra-ui/layout";
import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/menu";
import { Portal } from "@chakra-ui/portal";
import { Button, useColorModeValue } from "@chakra-ui/react";
import { CgMoreO } from "react-icons/cg";
import { Link as RouterLink, useParams } from "react-router-dom";

import useGetUserDoc from "../../hooks/useGetUserDoc";
import UserPosts from "./UserPosts";
import toast from "react-hot-toast";

const ProfilePage = () => {
	const { id: userId } = useParams();
	const { user } = useGetUserDoc(userId);
	const bgColor = useColorModeValue("gray.200", "gray.900");

	if (!user) {
		return <Text>Loading...</Text>;
	}

	const handleCopyUrl = () => {
		const url = `${window.location.origin}/profile/${user.uid}`;
		navigator.clipboard.writeText(url);
		toast.success("Link copied to clipboard");
	};

	return (
		<Container
			maxW={"720px"}
			my={10}
			bg={bgColor}
			borderRadius={"lg"}
			p={{
				base: 4,
				md: 10,
			}}
			boxShadow={"md"}
		>
			<VStack gap={4} alignItems={"start"} w={"full"}>
				<Flex justifyContent={"space-between"} w={"full"}>
					<Box>
						<Text fontSize={"2xl"} fontWeight={"bold"}>
							{user.fullName}
						</Text>
						{/* <Flex gap={2} alignItems={"center"}>
              <Text fontSize={"sm"}>emirhan yildirim</Text>
            </Flex> */}
					</Box>
					<Box>
						<Avatar
							src={user.profilePicURL || ""}
							size={{
								base: "md",
								md: "xl",
							}}
						/>
					</Box>
				</Flex>

				<Text>{user.email}</Text>

				<Link as={RouterLink} to={`/edit/${user.uid}`}>
					<Button size={"sm"}>Update Profile</Button>
				</Link>

				<Flex w={"full"} justifyContent={"space-between"}>
					<Flex gap={2} alignItems={"center"}>
						<Text color={"gray.light"}>{user.posts.length} posts</Text>
						<Box w='1' h='1' bg={"gray.light"} borderRadius={"full"}></Box>
					</Flex>
					<Flex>
						<Box className='icon-container'>
							<Menu>
								<MenuButton>
									<CgMoreO size={24} cursor={"pointer"} />
								</MenuButton>
								<Portal>
									<MenuList>
										<MenuItem onClick={handleCopyUrl}>Copy link</MenuItem>
									</MenuList>
								</Portal>
							</Menu>
						</Box>
					</Flex>
				</Flex>
				<UserPosts postIds={user.posts} />
			</VStack>
		</Container>
	);
};
export default ProfilePage;
