import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { firestore } from "../firebase/firebase";

const fetchUser = async (userId) => {
	const userDocRef = doc(firestore, "users", userId);
	const userDocSnap = await getDoc(userDocRef);
	if (userDocSnap.exists()) {
		return { id: userDocSnap.id, ...userDocSnap.data() };
	} else {
		return null; // User not found
	}
};

const useGetPosts = (postType) => {
	const [posts, setPosts] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const getPosts = async () => {
			setIsLoading(true);
			setError(null);
			try {
				const q = query(collection(firestore, "posts"), where("postType", "==", postType));

				const querySnapshot = await getDocs(q);

				const postsData = [];
				for (const doc of querySnapshot.docs) {
					const postData = { id: doc.id, ...doc.data() };
					const user = await fetchUser(postData.postedBy);
					if (user) {
						postData.postedBy = user; // Replace userID with user data
						postsData.push(postData);
					} else {
						console.log(`User not found for post with ID ${doc.id}`);
					}
				}

				setPosts(postsData);
			} catch (error) {
				setError(error);
			} finally {
				setIsLoading(false);
			}
		};

		getPosts();
	}, [postType]);
	console.log("getPosts called", posts);

	return { posts, isLoading, error };
};

export default useGetPosts;
