import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase/firebase";
import ProfilePage from "./pages/profile/ProfilePage";
import EditProfilePage from "./pages/edit-profile/EditProfilePage";

function App() {
	const [user, loading] = useAuthState(auth);

	if (loading) return null;

	return (
		<>
			<Routes>
				<Route path='/' element={user ? <HomePage /> : <Navigate to='/login' />} />
				<Route path='/login' element={!user ? <LoginPage /> : <Navigate to='/' />} />
				<Route path='/signup' element={!user ? <SignUpPage /> : <Navigate to='/' />} />
				<Route path='/profile/:id' element={user ? <ProfilePage /> : <Navigate to='/login' />} />
				<Route path='/edit/:id' element={user ? <EditProfilePage /> : <Navigate to='/login' />} />
			</Routes>
		</>
	);
}

export default App;
