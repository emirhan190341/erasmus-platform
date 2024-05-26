import { Container } from "@chakra-ui/react";
import useGetPosts from "../../hooks/useGetPosts";

import Post from "../../components/post/Post";
import PostSkeleton from "../../components/skeletons/PostSkeleton";

const QuestionsPage = () => {
	const { posts, error, isLoading } = useGetPosts("postType", "==", "question");

	return (
		<Container>
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
export default QuestionsPage;
