import { SearchIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Input, Text, useColorModeValue } from "@chakra-ui/react";
import Conversation from "./Conversation";
import { GiConversation } from "react-icons/gi";
// import MessageContainer from "../components/MessageContainer";
import { useEffect, useState } from "react";
import MessageContainer from "./MessageContainer";
import { collection, query, getDocs } from "firebase/firestore";
import { firestore } from "../../firebase/firebase";
import { useSelectedChat } from "../../zustand/useSelectedChat";

const ChatPage = () => {
	const [searchText, setSearchText] = useState("");
	const [users, setUsers] = useState([]);

	const { selectedChat } = useSelectedChat();

	useEffect(() => {
		const getAllUsers = async () => {
			try {
				const q = query(collection(firestore, "users"));

				const querySnapshot = await getDocs(q);
				const tmpUsers = [];
				querySnapshot.forEach((doc) => {
					// doc.data() is never undefined for query doc snapshots
					tmpUsers.push(doc.data());
				});
				setUsers(tmpUsers);
			} catch (error) {
				console.log(error.message);
			}
		};

		getAllUsers();
	}, []);

	return (
		<Box
			position={"absolute"}
			left={"50%"}
			w={{ base: "100%", md: "80%", lg: "1000px" }}
			p={4}
			transform={"translateX(-50%)"}
			border={"1px solid"}
			mt={20}
			borderColor={"gray.400"}
			rounded={"md"}
		>
			<Flex
				gap={4}
				flexDirection={{ base: "column", md: "row" }}
				maxW={{
					sm: "400px",
					md: "full",
				}}
				mx={"auto"}
			>
				<Flex flex={30} gap={2} flexDirection={"column"} maxW={{ sm: "250px", md: "full" }} mx={"auto"}>
					<Text fontWeight={700} color={useColorModeValue("gray.600", "gray.400")}>
						Your Conversations
					</Text>
					<form>
						<Flex alignItems={"center"} gap={2}>
							<Input placeholder='Search for a user' onChange={(e) => setSearchText(e.target.value)} />
							<Button size={"sm"}>
								<SearchIcon />
							</Button>
						</Flex>
					</form>

					{/* {loadingConversations &&
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
						))} */}

					{users &&
						users.map((conversation, i) => (
							<Conversation
								key={i}
								// isOnline={onlineUsers.includes(conversation.participants[0]._id)}
								conversation={conversation}
							/>
						))}
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
		</Box>
	);
};
export default ChatPage;
