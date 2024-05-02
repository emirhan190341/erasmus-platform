import { Avatar, Box, Divider, Flex, Image, Spinner, Text, Wrap, WrapItem } from "@chakra-ui/react";
import { GoDotFill } from "react-icons/go";
import { FaHeart, FaTrash } from "react-icons/fa";
import { FaComment } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/firebase";
import useDeletePost from "../../hooks/useDeletePost";

const Post = ({ post }) => {
	const postedBy = post.postedBy;
	const [user] = useAuthState(auth);
	const amITheOwner = user?.uid === postedBy.id;
	const { deletePost, isDeleting } = useDeletePost();

	return (
		<Box my={4}>
			<Flex gap={3}>
				{/* left */}
				<Wrap>
					<WrapItem>
						<Avatar size='md' src={postedBy.profilePicURL} />
					</WrapItem>
				</Wrap>
				{/* right */}
				<Flex flexDir={"column"} gap={2} w='full'>
					<Flex justifyContent={"space-between"} alignItems={"center"} w='full'>
						{/* sol */}
						<Flex gap={1} alignItems={"center"}>
							<Text>{postedBy.fullName}</Text>
							<Text color={"gray.500"}>@{postedBy.username}</Text>
							<Box color={"gray.500"}>
								<GoDotFill size={"10px"} />
							</Box>
							<Text color={"gray.500"}>5h</Text>
						</Flex>
						{/* sağ */}
						{amITheOwner && (
							<Box _hover={{ color: "red.400", cursor: "pointer" }} onClick={() => deletePost(post)}>
								{isDeleting ? <Spinner size={"sm"} /> : <FaTrash size={20} />}
							</Box>
						)}
					</Flex>
					<Text fontSize={"25px"} fontWeight={"bold"}>
						{post.title}
					</Text>
					<Text fontSize={"16px"}>{post.description}</Text>
					{post.image && (
						<Image
							src={post.image}
							alt='Segun Adebayo'
							borderRadius={"md"}
							border={"1px solid"}
							borderColor={"gray.600"}
						/>
					)}
					<Divider />
					<Flex gap={4} justifyContent={"space-between"} w={"50%"} mx={"auto"}>
						<Flex gap={1} alignItems={"center"} color={"pink.500"}>
							<FaHeart size={20} />
							<Text>{post.likes.length}</Text>
						</Flex>
						<Flex gap={1} alignItems={"center"} color={"green.500"}>
							<FaComment size={20} />
							<Text>{post.comments.length}</Text>
						</Flex>
						<Flex gap={1} alignItems={"center"} color={"blue.500"}>
							<FaBookmark size={20} />
							<Text>{post.bookmarks}</Text>
						</Flex>
					</Flex>
				</Flex>
			</Flex>
		</Box>
	);
};
export default Post;
