import { arrayRemove, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { auth, firestore, storage } from "../firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useState } from "react";
import toast from "react-hot-toast";
import { deleteObject, ref } from "firebase/storage";
import { usePosts } from "../zustand/usePosts";

const useDeletePost = () => {
	const [isDeleting, setIsDeleting] = useState(false);
	const [authUser] = useAuthState(auth);
	const { setPosts, posts } = usePosts();

	const deletePost = async (post) => {
		if (!window.confirm("Are you sure you want to delete this post?")) return;
		if (isDeleting) return;

		setIsDeleting(true);
		try {
			const userRef = doc(firestore, "users", authUser.uid);
			await deleteDoc(doc(firestore, "posts", post.id));

			await updateDoc(userRef, {
				posts: arrayRemove(post.id),
			});

			if (post.image) {
				const imageRef = ref(storage, `posts/${authUser.uid}/${post.id}`);
				await deleteObject(imageRef);
			}
			const updatedPosts = posts.filter((p) => p.id !== post.id);
			setPosts(updatedPosts);
			toast.success("Post deleted successfully");
		} catch (error) {
			console.error("Error deleting post: ", error);
			toast.error("Failed to delete post");
		} finally {
			setIsDeleting(false);
		}
	};

	return { deletePost, isDeleting };
};
export default useDeletePost;
