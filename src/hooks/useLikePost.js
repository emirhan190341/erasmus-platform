import { arrayRemove, arrayUnion, doc, increment, updateDoc } from "firebase/firestore";
import { auth, firestore } from "../firebase/firebase";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import useGetUserDoc from "./useGetUserDoc";

const useLikePost = (post) => {
	const { user: currentUser } = useGetUserDoc(auth.currentUser?.uid);

	const [isLiked, setIsLiked] = useState(false);

	useEffect(() => {
		if (currentUser) {
			setIsLiked(currentUser.likedPosts.includes(post.id));
		}
	}, [currentUser, post.id]);

	const likePost = async () => {
		try {
			// increment the likes count in the post document +1
			const postRef = doc(firestore, "posts", post.id);
			const userRef = doc(firestore, "users", currentUser.uid);

			if (isLiked) {
				await updateDoc(postRef, {
					likes: increment(-1),
				});

				// remove the post id from the likedPosts array in the user document
				await updateDoc(userRef, {
					likedPosts: arrayRemove(post.id),
				});

				post.likes -= 1;
				setIsLiked(false);
			} else {
				await updateDoc(postRef, {
					likes: increment(1),
				});
				// add the post id to the likedPosts array in the user document
				await updateDoc(userRef, {
					likedPosts: arrayUnion(post.id),
				});
				post.likes += 1;
				setIsLiked(true);
			}
		} catch (error) {
			console.error("Error updating document: ", error);
			toast.error("Failed to like the post");
		}
	};

	return { likePost, isLiked };
};
export default useLikePost;
