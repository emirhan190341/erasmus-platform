import { SearchIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Input, Skeleton, SkeletonCircle, Text, useColorModeValue } from "@chakra-ui/react";
import Conversation from "./Conversation";
import { GiConversation } from "react-icons/gi";
import { useEffect, useState } from "react";
import MessageContainer from "./MessageContainer";
import { collection, query, getDocs } from "firebase/firestore";
import { auth, firestore } from "../../firebase/firebase";
import { useSelectedChat } from "../../zustand/useSelectedChat";
import { useAuthState } from "react-firebase-hooks/auth";
import toast from "react-hot-toast";

const ChatPage = () => {
	const [searchText, setSearchText] = useState("");
	const [users, setUsers] = useState([]);
	const [loadingConversations, setLoadingConversations] = useState(true);

	const { selectedChat, setSelectedChat } = useSelectedChat();
	const [authUser] = useAuthState(auth);

	useEffect(() => {
		const getAllUsers = async () => {
			try {
				const q = query(collection(firestore, "users"));

				const querySnapshot = await getDocs(q);
				const tmpUsers = [];
				querySnapshot.forEach((doc) => {
					tmpUsers.push(doc.data());
				});
				// remove the current user from the list
				const filteredUsers = tmpUsers.filter((user) => user.uid !== authUser.uid);
				setUsers(filteredUsers);
			} catch (error) {
				console.log(error.message);
			} finally {
				setLoadingConversations(false);
			}
		};

		getAllUsers();

		// cleanup, reset
		return () => setSelectedChat(null);
	}, [authUser.uid, setSelectedChat]);

	const handleSearchUser = async (e) => {
		e.preventDefault();
		if (searchText.length < 3) return toast.error("Search term must be at least 3 characters long");
		const searchTerm = searchText.toLowerCase();
		const searchedUser = users.find((user) => user.fullName.toLowerCase().includes(searchTerm));

		if (searchedUser) {
			setSelectedChat(searchedUser);
		} else {
			toast.error("User not found");
		}
		setSearchText("");
	};

	return (
		<Box mx={10}>
			<Flex
				justifyContent={"center"}
				alignItems={"center"}
				maxW={{ base: "100%", md: "80%", lg: "800px" }}
				mx={"auto"}
				p={4}
				border={"2px solid"}
				my={10}
				borderColor={"gray.700"}
				rounded={"md"}
			>
				<Flex
					gap={4}
					flexDirection={{ base: "column", md: "row" }}
					maxW={{
						sm: "400px",
						md: "100%",
					}}
					w={"full"}
					mx={"auto"}
				>
					<Flex flex={30} gap={2} flexDirection={"column"} maxW={{ sm: "250px", md: "full" }} mx={"auto"}>
						<Text fontWeight={700} color={useColorModeValue("gray.600", "gray.400")}>
							Your Conversations
						</Text>
						<form onSubmit={handleSearchUser}>
							<Flex alignItems={"center"} gap={2}>
								<Input
									placeholder='Search for a user'
									onChange={(e) => setSearchText(e.target.value)}
									value={searchText}
								/>
								<Button size={"sm"} type='submit'>
									<SearchIcon />
								</Button>
							</Flex>
						</form>

						{loadingConversations &&
							[0, 1, 2, 3, 4].map((_, i) => (
								<Flex key={i} gap={4} alignItems={"center"} p={"1"} borderRadius={"md"}>
									<Box>
										<SkeletonCircle size={"10"} />
									</Box>
									<Flex w={"full"} flexDirection={"column"} gap={3}>
										<Skeleton h={"10px"} w={"80px"} />
										<Skeleton h={"8px"} w={"90%"} />
									</Flex>
								</Flex>
							))}

						{users && users.map((conversation, i) => <Conversation key={i} conversation={conversation} />)}
					</Flex>
					{!selectedChat && (
						<Flex
							flex={70}
							borderRadius={"md"}
							p={2}
							flexDir={"column"}
							alignItems={"center"}
							justifyContent={"center"}
							height={"400px"}
						>
							<GiConversation size={100} />
							<Text fontSize={20}>Select a conversation to start messaging</Text>
						</Flex>
					)}

					{selectedChat && <MessageContainer />}
				</Flex>
			</Flex>
		</Box>
	);
};
export default ChatPage;
