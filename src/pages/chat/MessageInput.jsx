import {
	Flex,
	Image,
	Input,
	InputGroup,
	InputRightElement,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Spinner,
	useDisclosure,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { IoSendSharp } from "react-icons/io5";
import { collection, doc, setDoc, arrayUnion, getDoc } from "firebase/firestore";

import { BsFillImageFill } from "react-icons/bs";
import { auth, firestore } from "../../firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useSelectedChat } from "../../zustand/useSelectedChat";

const MessageInput = () => {
	const [messageText, setMessageText] = useState("");
	const [user] = useAuthState(auth);
	const { selectedChat } = useSelectedChat();
	const imageRef = useRef(null);

	const handleSendMessage = async (e) => {
		e.preventDefault();
		try {
			// create a message document
			const newMessage = doc(collection(firestore, "messages"));
			await setDoc(newMessage, {
				senderId: user.uid,
				text: messageText,
				createdAt: new Date(),
				receiverId: selectedChat.uid,
			});

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
			messagesArray.push(newMessage.id);

			// Update conversation document with the new messages array
			await setDoc(conversationRef, {
				participants: [user.uid, selectedChat.uid],
				messages: messagesArray,
			});

			// add conversationId field to the message document
			await setDoc(newMessage, { conversationId: conversationRef.id }, { merge: true });

			setMessageText("");
		} catch (error) {
			console.error("Error adding document: ", error);
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
					/>
					<InputRightElement onClick={handleSendMessage} cursor={"pointer"}>
						<IoSendSharp />
					</InputRightElement>
				</InputGroup>
			</form>
			<Flex flex={5} cursor={"pointer"}>
				<BsFillImageFill size={20} onClick={() => imageRef.current.click()} />
				<Input type={"file"} hidden ref={imageRef} />
			</Flex>
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
