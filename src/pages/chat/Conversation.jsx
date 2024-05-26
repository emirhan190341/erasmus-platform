import { Avatar, Box, Flex, Stack, Text, WrapItem, useColorMode, useColorModeValue } from "@chakra-ui/react";
import { BsCheck2All } from "react-icons/bs";
import { useSelectedChat } from "../../zustand/useSelectedChat";

const Conversation = ({ conversation }) => {
	const user = conversation;
	const currentUser = {
		_id: "1",
		username: "Emirhan Yildirim",
		email: "sada@email.com",
	};
	const { selectedChat, setSelectedChat } = useSelectedChat();

	const lastMessage = conversation.lastMessage;
	const { colorMode } = useColorMode();

	return (
		<Flex
			gap={4}
			alignItems={"center"}
			p={"1"}
			_hover={{
				cursor: "pointer",
				bg: useColorModeValue("gray.600", "gray.600"),
				color: "white",
			}}
			transition={"all 0.3s"}
			bg={selectedChat?.uid === conversation.uid ? (colorMode === "light" ? "gray.200" : "gray.700") : ""}
			// bg={colorMode === "light" ? "gray.200" : "gray.700"}
			borderRadius={"md"}
			onClick={() =>
				setSelectedChat({
					uid: conversation.uid,
					profilePicURL: user.profilePicURL,
					fullName: user.fullName,
				})
			}
		>
			<WrapItem>
				<Avatar
					size={{
						base: "xs",
						sm: "sm",
					}}
					src={user.profilePicURL}
				/>
			</WrapItem>

			<Stack direction={"column"} fontSize={"sm"}>
				<Text fontWeight='700' display={"flex"} alignItems={"center"}>
					{user.fullName}
				</Text>
				<Text fontSize={"xs"} display={"flex"} alignItems={"center"}>
					{currentUser?._id === lastMessage?.sender ? (
						<Box color={lastMessage.seen ? "blue.400" : ""}>
							<BsCheck2All size={16} />
						</Box>
					) : (
						""
					)}
				</Text>
			</Stack>
		</Flex>
	);
};

export default Conversation;
