import { Avatar, Divider, Flex, Skeleton, SkeletonCircle, Text, useColorModeValue } from "@chakra-ui/react";
import Message from "./Message";
import MessageInput from "./MessageInput";
import { useEffect, useState } from "react";
import { useSelectedChat } from "../../zustand/useSelectedChat";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { auth, firestore } from "../../firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import toast from "react-hot-toast";
import useChatScroll from "../../hooks/useChatScroll";

const MessageContainer = () => {
	const [loadingMessages, setLoadingMessages] = useState(false);

	const [user] = useAuthState(auth);

	const { selectedChat } = useSelectedChat();
	const [messages, setMessages] = useState([]);
	const messageContainerRef = useChatScroll(messages);

	useEffect(() => {
		const getMessages = async () => {
			try {
				console.log("called");

				// Query for messages sent by the current user to the selected user
				const q1 = query(
					collection(firestore, "messages"),
					where("senderId", "==", user.uid),
					where("receiverId", "==", selectedChat.uid),
					orderBy("createdAt", "asc") // Order messages by timestamp in ascending order
				);

				// Query for messages sent by the selected user to the current user
				const q2 = query(
					collection(firestore, "messages"),
					where("senderId", "==", selectedChat.uid),
					where("receiverId", "==", user.uid),
					orderBy("createdAt", "asc") // Order messages by timestamp in ascending order
				);

				const unsubscribe1 = onSnapshot(q1, (querySnapshot1) => {
					const msgs1 = [];
					querySnapshot1.forEach((doc) => {
						msgs1.push({ id: doc.id, ...doc.data() });
					});

					// Combine messages from both queries
					const unsubscribe2 = onSnapshot(q2, (querySnapshot2) => {
						const msgs2 = [];
						querySnapshot2.forEach((doc) => {
							msgs2.push({ id: doc.id, ...doc.data() });
						});

						// Merge both arrays and sort by createdAt
						const allMsgs = [...msgs1, ...msgs2].sort((a, b) => a.createdAt - b.createdAt);
						setMessages(allMsgs);
					});

					// Clean up the second subscription
					return () => unsubscribe2();
				});

				setLoadingMessages(false);

				// Clean up the first subscription
				return () => unsubscribe1();
			} catch (error) {
				toast.error(error.message);
			}
		};
		getMessages();
	}, [selectedChat.uid, user.uid]);

	return (
		<Flex
			flex='70'
			bg={useColorModeValue("gray.200", "gray.dark")}
			borderRadius={"md"}
			p={2}
			flexDirection={"column"}
		>
			{/* Message header */}
			<Flex w={"full"} h={12} alignItems={"center"} gap={2}>
				<Avatar src={selectedChat.profilePicURL} size={"sm"} />

				<Text display={"flex"} alignItems={"center"}>
					{selectedChat.fullName}
				</Text>
			</Flex>

			<Divider />

			<Flex flexDir={"column"} gap={4} my={4} p={2} height={"400px"} overflowY={"auto"} ref={messageContainerRef}>
				{loadingMessages &&
					[...Array(5)].map((_, i) => (
						<Flex
							key={i}
							gap={2}
							alignItems={"center"}
							p={1}
							borderRadius={"md"}
							alignSelf={i % 2 === 0 ? "flex-start" : "flex-end"}
						>
							{i % 2 === 0 && <SkeletonCircle size={7} />}
							<Flex flexDir={"column"} gap={2}>
								<Skeleton h='8px' w='250px' />
								<Skeleton h='8px' w='250px' />
								<Skeleton h='8px' w='250px' />
							</Flex>
							{i % 2 !== 0 && <SkeletonCircle size={7} />}
						</Flex>
					))}

				{!loadingMessages &&
					messages.map((message, idx) => (
						<Flex key={idx} direction={"column"}>
							<Message message={message} ownMessage={user.uid === message.senderId} />
						</Flex>
					))}
			</Flex>

			<MessageInput />
		</Flex>
	);
};

export default MessageContainer;
