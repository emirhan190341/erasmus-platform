import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import toast from "react-hot-toast";
import { auth, firestore } from "../firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const usePostComment = () => {
	const [isCommenting, setIsCommenting] = useState(false);
	const [authUser] = useAuthState(auth);

	const postComment = async (post, comment) => {
		try {
			setIsCommenting(true);
			const postRef = doc(firestore, "posts", post.id);

			await updateDoc(postRef, {
				comments: arrayUnion({
					comment,
					commentedBy: {
						id: authUser.uid,
						fullName: authUser.displayName,
						username: authUser.email.split("@")[0],
						profilePicURL: authUser.photoURL,
					},
					createdAt: Date.now(),
				}),
			});

			toast.success("Comment posted!");
			post.comments.push({
				comment,
				commentedBy: {
					id: authUser.uid,
					fullName: authUser.displayName,
					username: authUser.email.split("@")[0],
					profilePicURL: authUser.photoURL,
				},
				createdAt: Date.now(),
			});
			return true;
		} catch (error) {
			console.log(error);
			toast.error("Failed to post comment");
		} finally {
			setIsCommenting(false);
		}
	};

	return { postComment, isCommenting };
};
export default usePostComment;
