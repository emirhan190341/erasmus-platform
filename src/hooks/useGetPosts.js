import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { firestore } from "../firebase/firebase";
import { usePosts } from "../zustand/usePosts";

const fetchUser = async (userId) => {
	const userDocRef = doc(firestore, "users", userId);
	const userDocSnap = await getDoc(userDocRef);
	if (userDocSnap.exists()) {
		return { id: userDocSnap.id, ...userDocSnap.data() };
	} else {
		return null; // User not found
	}
};

const useGetPosts = (postFilter, queryOperator, postType) => {
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const { posts, setPosts } = usePosts();

	useEffect(() => {
		const getPosts = async () => {
			setIsLoading(true);
			setError(null);
			setPosts([]); // Clear the posts array
			try {
				const q = query(collection(firestore, "posts"), where(postFilter, queryOperator, postType));

				const querySnapshot = await getDocs(q);
				console.log("querySnapshot", querySnapshot.docs);
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
	}, [setPosts, postFilter, queryOperator]);

	return { posts, isLoading, error, setPosts };
};

export default useGetPosts;
