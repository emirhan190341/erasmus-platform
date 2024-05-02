import { Container } from "@chakra-ui/react";
import useGetPosts from "../../hooks/useGetPosts";
import Post from "../../components/post/Post";
import PostSkeleton from "../../components/skeletons/PostSkeleton";

const ExperiencesPage = () => {
	const { posts, error, isLoading } = useGetPosts("experience");

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
export default ExperiencesPage;
