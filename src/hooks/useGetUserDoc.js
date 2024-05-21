import { useEffect, useState } from "react";
import { firestore } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";

const useGetUserDoc = (userId) => {
	const [user, setUser] = useState(null);

	useEffect(() => {
		const getUser = async () => {
			try {
				const userDoc = await getDoc(doc(firestore, "users", userId));
				setUser(userDoc.data());
			} catch (error) {
				console.log(error.message);
				setUser(null);
			}
		};
		getUser();
	}, [userId]);

	return { user };
};
export default useGetUserDoc;
