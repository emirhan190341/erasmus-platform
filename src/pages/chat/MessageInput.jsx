import { Flex, Input, InputGroup, InputRightElement, Spinner } from "@chakra-ui/react";
import { useState } from "react";
import { IoSendSharp } from "react-icons/io5";
import { collection, doc, setDoc, getDoc } from "firebase/firestore";

import { auth, firestore } from "../../firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useSelectedChat } from "../../zustand/useSelectedChat";

import OpenAI from "openai";
const apiKey = import.meta.env.VITE_OPEN_AI_API_KEY;

const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

const MessageInput = () => {
	const [messageText, setMessageText] = useState("");
	const [user] = useAuthState(auth);
	const { selectedChat } = useSelectedChat();
	const [isLoading, setIsLoading] = useState(false);

	const handleSendMessage = async (e) => {
		e.preventDefault();

		try {
			setIsLoading(true);
			const newMessageRef = doc(collection(firestore, "messages"));

			const askedForAI = messageText.startsWith("@gpt");

			// create a message document
			await setDoc(newMessageRef, {
				senderId: user.uid,
				text: messageText,
				createdAt: new Date(),
				receiverId: selectedChat.uid,
			});
			setMessageText("");

			if (askedForAI) {
				const res = await openai.chat.completions.create({
					model: "gpt-3.5-turbo", // "gpt-4" also works, but is so slow!
					messages: [
						{
							role: "system",
							content:
								"You are a terse bot in a group chat responding to questions with up to 3-sentence answers",
						},
						{
							role: "user",
							content: messageText,
						},
					],
				});
				const answerFromAI = res.choices[0].message.content;
				const newMessageRef = doc(collection(firestore, "messages"));

				await setDoc(newMessageRef, {
					senderId: user.uid,
					fromAI: true,
					text: answerFromAI,
					createdAt: new Date(),
					receiverId: selectedChat.uid,
				});
			}

			// Add a new document with a generated id for conversation
			const conversationId = `${user.uid}_${selectedChat.uid}`;
			const conversationRef = doc(firestore, "conversations", conversationId);
			const conversationSnap = await getDoc(conversationRef);
			let messagesArray = [];
			if (conversationSnap.exists()) {
				const conversationData = conversationSnap.data();
				messagesArray = conversationData.messages || [];
			}

			// Append the new message ID
			messagesArray.push(newMessageRef.id);

			// Update conversation document with the new messages array
			await setDoc(conversationRef, {
				participants: [user.uid, selectedChat.uid],
				messages: messagesArray,
			});

			// add conversationId field to the message document
			await setDoc(newMessageRef, { conversationId: conversationRef.id }, { merge: true });
		} catch (error) {
			console.error("Error adding document: ", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Flex gap={2} alignItems={"center"}>
			<form onSubmit={handleSendMessage} style={{ flex: 95 }}>
				<InputGroup>
					<Input
						w={"full"}
						placeholder='Type a message'
						onChange={(e) => setMessageText(e.target.value)}
						value={messageText}
						disabled={isLoading}
					/>
					<InputRightElement onClick={handleSendMessage} cursor={"pointer"}>
						{isLoading ? <Spinner size={"sm"} /> : <IoSendSharp />}
					</InputRightElement>
				</InputGroup>
			</form>
			{/* <Flex flex={5} cursor={"pointer"}>
				<BsFillImageFill size={20} onClick={() => imageRef.current.click()} />
				<Input type={"file"} hidden ref={imageRef} />
			</Flex> */}
			{/* <Modal
				isOpen={imgUrl}
				onClose={() => {
					onClose();
					setImgUrl("");
				}}
			>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader></ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Flex mt={5} w={"full"}>
							<Image src={imgUrl} />
						</Flex>
						<Flex justifyContent={"flex-end"} my={2}>
							{!isSending ? (
								<IoSendSharp size={24} cursor={"pointer"} onClick={handleSendMessage} />
							) : (
								<Spinner size={"md"} />
							)}
						</Flex>
					</ModalBody>
				</ModalContent>
			</Modal> */}
		</Flex>
	);
};

export default MessageInput;
