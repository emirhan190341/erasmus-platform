import {
	Avatar,
	Box,
	Button,
	Divider,
	Flex,
	Image,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Spinner,
	Text,
	Wrap,
	WrapItem,
	useDisclosure,
} from "@chakra-ui/react";
import { GoDotFill } from "react-icons/go";
import { FaHeart, FaTrash } from "react-icons/fa";
import { FaComment } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/firebase";
import useDeletePost from "../../hooks/useDeletePost";
import { formatPostDate, timeAgo } from "../../lib/utils/date";
import useLikePost from "../../hooks/useLikePost";
import useBookmarkPost from "../../hooks/useBookmarkPost";
import usePostComment from "../../hooks/usePostComment";
import { Link } from "react-router-dom";
import { useState } from "react";
import useChatScroll from "../../hooks/useChatScroll";

const Post = ({ post }) => {
	const [comment, setComment] = useState("");

	const postedBy = post.postedBy;
	const [user] = useAuthState(auth);
	const amITheOwner = user?.uid === postedBy.id;
	const { deletePost, isDeleting } = useDeletePost();

	const { likePost, isLiked } = useLikePost(post);
	const { isBookmarked, bookmarkPost } = useBookmarkPost(post);
	const { isCommenting, postComment } = usePostComment();

	const { onClose, onOpen, isOpen } = useDisclosure();

	const commentRef = useChatScroll(isCommenting);
	return (
		<Box my={6} border={"1px solid gray"} rounded={"md"}>
			<Flex gap={3} p={3}>
				{/* left */}
				<Wrap>
					<WrapItem>
						<Link to={`/profile/${postedBy.id}`}>
							<Avatar size='md' src={postedBy.profilePicURL} />
						</Link>
					</WrapItem>
				</Wrap>
				{/* right */}
				<Flex flexDir={"column"} gap={2} w='full'>
					<Flex justifyContent={"space-between"} alignItems={"center"} w='full'>
						{/* sol */}
						<Flex gap={1} alignItems={"center"}>
							<Link to={`/profile/${postedBy.id}`}>
								<Text
									fontSize={{
										base: "sm",
										md: "md",
									}}
								>
									{postedBy.fullName}
								</Text>
								<Text
									color={"gray.500"}
									fontSize={{
										base: "xs",
										md: "md",
									}}
								>
									@{postedBy.username}
								</Text>
							</Link>
							<Box color={"gray.500"}>
								<GoDotFill size={6} />
							</Box>
							<Text
								color={"gray.500"}
								fontSize={{
									base: "xs",
									md: "md",
								}}
							>
								{formatPostDate(post.createdAt)}
							</Text>
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
						<Flex
							gap={1}
							alignItems={"center"}
							color={isLiked ? "pink.500" : ""}
							onClick={likePost}
							cursor='pointer'
						>
							<FaHeart size={20} />
							<Text>{post.likes.length}</Text>
						</Flex>
						<Flex gap={1} alignItems={"center"} cursor={"pointer"} onClick={onOpen}>
							<FaComment size={20} />
							<Text>{post.comments.length}</Text>
						</Flex>
						<Flex gap={1} alignItems={"center"} color={isBookmarked ? "blue.500" : ""}>
							<FaBookmark size={20} onClick={bookmarkPost} cursor='pointer' />
							<Text>{post.bookmarks}</Text>
						</Flex>
					</Flex>
				</Flex>
			</Flex>

			{/* COMMENT MODAL */}
			<Modal isOpen={isOpen} onClose={onClose} motionPreset='slideInLeft'>
				<ModalOverlay />
				<ModalContent border={"1px solid gray"} maxW={"400px"}>
					<ModalHeader>Comments</ModalHeader>
					<ModalCloseButton />
					<ModalBody pb={6}>
						<Flex mb={4} gap={4} flexDir={"column"} maxH={"250px"} overflowY={"auto"} ref={commentRef}>
							{post.comments.map((comment, idx) => (
								<Flex gap={4} key={idx}>
									<Link to={`/profile/${comment.commentedBy.id}`}>
										<Avatar src={comment.commentedBy.profilePicURL} size={"sm"} />
									</Link>
									<Flex direction={"column"}>
										<Flex gap={2} alignItems={"center"}>
											<Link to={`/profile/${comment.commentedBy.id}`}>
												<Text fontWeight={"bold"} fontSize={12}>
													{comment.commentedBy.username}
												</Text>
											</Link>
											<Text fontSize={14}>{comment.comment}</Text>
										</Flex>
										<Text fontSize={12} color={"gray"}>
											{timeAgo(comment.createdAt)}
										</Text>
									</Flex>
								</Flex>
							))}
						</Flex>
						<form
							onSubmit={async (e) => {
								e.preventDefault();
								await postComment(post, comment);
								setComment("");
							}}
							style={{ marginTop: "2rem" }}
						>
							<Input
								placeholder='Comment'
								size={"sm"}
								onChange={(e) => setComment(e.target.value)}
								value={comment}
							/>
							<Flex w={"full"} justifyContent={"flex-end"}>
								<Button type='submit' ml={"auto"} size={"sm"} my={4} isLoading={isCommenting}>
									Post
								</Button>
							</Flex>
						</form>
					</ModalBody>
				</ModalContent>
			</Modal>
		</Box>
	);
};
export default Post;
