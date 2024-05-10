import { Avatar, Divider, Flex, Image, Skeleton, SkeletonCircle, Text, useColorModeValue } from "@chakra-ui/react";
import Message from "./Message";
import MessageInput from "./MessageInput";
import { useEffect, useRef, useState } from "react";
import { useSelectedChat } from "../../zustand/useSelectedChat";
import { collection, getDocs, onSnapshot, query, where } from "firebase/firestore";
import { auth, firestore } from "../../firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const MessageContainer = () => {
	const [loadingMessages, setLoadingMessages] = useState(false);
	const currentUser = {
		_id: "1",
		username: "Emirhan Yildirim",
		email: "dasa@ss.com",
	};

	const [user] = useAuthState(auth);
	const messageEndRef = useRef(null);

	const { selectedChat, setSelectedChat } = useSelectedChat();
	const [messages, setMessages] = useState([]);

	// const messages = [
	// 	{
	// 		_id: "1",
	// 		sender: "1",
	// 		text: "Hello",
	// 		createdAt: new Date(),
	// 	},
	// 	{
	// 		_id: "2",
	// 		sender: "2",
	// 		text: "Hi",
	// 		createdAt: new Date(),
	// 	},
	// 	{
	// 		_id: "3",
	// 		sender: "1",
	// 		text: "How are you?",
	// 		createdAt: new Date(),
	// 	},
	// 	{
	// 		_id: "4",
	// 		sender: "2",
	// 		text: "I'm fine",
	// 		createdAt: new Date(),
	// 	},
	// 	{
	// 		_id: "5",
	// 		sender: "1",
	// 		text: "Good to hear that",
	// 		createdAt: new Date(),
	// 	},
	// 	{
	// 		_id: "6",
	// 		sender: "2",
	// 		text: "How about you?",
	// 		createdAt: new Date(),
	// 	},
	// 	{
	// 		_id: "7",
	// 		sender: "1",
	// 		text: "I'm fine too",
	// 		createdAt: new Date(),
	// 	},
	// 	{
	// 		_id: "8",
	// 		sender: "2",
	// 		text: "What are you doing?",
	// 		createdAt: new Date(),
	// 	},
	// 	{
	// 		_id: "9",
	// 		sender: "1",
	// 		text: "I'm working",
	// 		createdAt: new Date(),
	// 	},
	// 	{
	// 		_id: "10",
	// 		sender: "2",
	// 		text: "Good luck",
	// 		createdAt: new Date(),
	// 	},
	// ];

	// useEffect(() => {
	// 	const getMessages = async () => {
	// 		try {
	// 			// 1 => get conversation between current and the other user
	// 			// 2 => fetch all messages between these users and listen for new messages
	// 			const q = query(collection(firestore, "messages"), where("state", "==", "CA"));
	// 			const unsubscribe = onSnapshot(q, (querySnapshot) => {
	// 				const msgs = [];
	// 				querySnapshot.forEach((doc) => {
	// 					msgs.push({ id: doc.id, ...doc.data() });
	// 				});
	// 				console.log(msgs);
	// 			});
	// 		} catch (error) {
	// 			console.log(error.message);
	// 		}
	// 	};
	// 	getMessages();
	// }, []);

	useEffect(() => {
		let unsubscribe; // Declare unsubscribe variable outside the try block

		const getMessages = async () => {
			try {
				// Step 1: Get conversation between current user and other user
				const currentUserID = user.uid;
				const otherUserID = selectedChat.uid;

				// Query conversations collection based on the concatenated participant IDs
				const conversationQuery = query(
					collection(firestore, "conversations"),
					where("participants", "==", [currentUserID, otherUserID].sort())
				);

				const conversationSnapshot = await getDocs(conversationQuery);
				if (!conversationSnapshot.empty) {
					const conversationDoc = conversationSnapshot.docs[0];
					const conversationID = conversationDoc.id;

					// Step 2: Fetch all messages in the conversation and listen for new messages
					const messagesQuery = query(
						collection(firestore, "messages"),
						where("conversationId", "==", conversationID)
					);
					unsubscribe = onSnapshot(messagesQuery, (querySnapshot) => {
						const msgs = [];
						querySnapshot.forEach((doc) => {
							console.log("message is here", doc.data());
							msgs.push({ id: doc.id, ...doc.data() });
						});
						// sort messages by createdAt timestamp
						msgs.sort((a, b) => a.createdAt - b.createdAt);
						setMessages(msgs);
						console.log(msgs);
					});
				} else {
					setMessages([]);
				}
			} catch (error) {
				console.log(error.message);
			}
		};

		getMessages();

		// Cleanup function to unsubscribe from snapshot listener
		return () => {
			if (unsubscribe) {
				unsubscribe();
			}
		};
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
					{selectedChat.fullName} <Image src='/verified.png' w={4} h={4} ml={1} />
				</Text>
			</Flex>

			<Divider />

			<Flex flexDir={"column"} gap={4} my={4} p={2} height={"400px"} overflowY={"auto"}>
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
					messages.map((message) => (
						<Flex
							key={message._id}
							direction={"column"}
							ref={messages.length - 1 === messages.indexOf(message) ? messageEndRef : null}
						>
							<Message message={message} ownMessage={currentUser._id === message.sender} />
						</Flex>
					))}
			</Flex>

			<MessageInput />
		</Flex>
	);
};

export default MessageContainer;
