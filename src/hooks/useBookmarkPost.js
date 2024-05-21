import toast from "react-hot-toast";
import { auth, firestore } from "../firebase/firebase";
import { arrayUnion, doc, increment, updateDoc } from "firebase/firestore";
import useGetUserDoc from "./useGetUserDoc";
import { useEffect, useState } from "react";

// TODO: BOOKMARK KENDILIĞINDEND ARRAYA EKLENİYOR
const useBookmarkPost = (post) => {
	const { user: currentUser } = useGetUserDoc(auth.currentUser?.uid);

	const [isBookmarked, setIsBookmarked] = useState(false);

	useEffect(() => {
		if (currentUser) {
			setIsBookmarked(currentUser?.bookmarks?.includes(post.id));
		}
	}, [currentUser, post.id]);

	const bookmarkPost = async () => {
		try {
			const userRef = doc(firestore, "users", auth.currentUser.uid);
			const postRef = doc(firestore, "posts", post.id);

			if (isBookmarked) {
				await updateDoc(userRef, {
					bookmarks: arrayUnion(post.id),
				});

				await updateDoc(postRef, {
					bookmarks: increment(-1),
				});
				post.bookmarks -= 1;
				setIsBookmarked(false);
			} else {
				await updateDoc(userRef, {
					bookmarks: arrayUnion(post.id),
				});

				await updateDoc(postRef, {
					bookmarks: increment(1),
				});
				post.bookmarks += 1;
				setIsBookmarked(true);
			}
		} catch (error) {
			toast.error("Failed to bookmark the post");
		}
	};

	return { bookmarkPost, isBookmarked };
};
export default useBookmarkPost;
