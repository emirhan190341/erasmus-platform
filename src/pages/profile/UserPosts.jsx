import { Container, Text } from "@chakra-ui/react";
import { auth } from "../../firebase/firebase";
import useGetPosts from "../../hooks/useGetPosts";
import Post from "../../components/post/Post";
import PostSkeleton from "../../components/skeletons/PostSkeleton";

const UserPosts = () => {
	const { posts, isLoading, error } = useGetPosts("postedBy", "==", auth.currentUser.uid);
	return (
		<Container>
			<Text textAlign={"center"} fontSize={24} text>
				Posts
			</Text>
			{posts.map((post) => (
				<Post key={post.id} post={post} />
			))}

			{isLoading && (
				<>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</>
			)}
			{error && <p>{error.message}</p>}
		</Container>
	);
};
export default UserPosts;
