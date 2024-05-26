import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase/firebase";
import ProfilePage from "./pages/profile/ProfilePage";
import EditProfilePage from "./pages/edit-profile/EditProfilePage";
import Navbar from "./components/ui/Navbar";
import MostAskedPage from "./pages/most-asked/MostAskedPage";
import CreatePostPage from "./pages/create/CreatePostPage";
import ExperiencesPage from "./pages/experiences/ExperiencesPage";
import QuestionsPage from "./pages/questions/QuestionsPage";
import { Toaster } from "react-hot-toast";
import ChatPage from "./pages/chat/ChatPage";

function App() {
	const [user, loading] = useAuthState(auth);

	if (loading) return null;

	return (
		<>
			<Navbar />

			<Routes>
				<Route path='/' element={<HomePage />} />
				<Route path='/login' element={!user ? <LoginPage /> : <Navigate to='/' />} />
				<Route path='/signup' element={!user ? <SignUpPage /> : <Navigate to='/' />} />
				<Route path='/profile/:id' element={user ? <ProfilePage /> : <Navigate to='/login' />} />
				<Route path='/edit/:id' element={user ? <EditProfilePage /> : <Navigate to='/login' />} />
				<Route path='/create' element={user ? <CreatePostPage /> : <Navigate to='/login' />} />
				<Route path='/experiences' element={user ? <ExperiencesPage /> : <Navigate to='/login' />} />
				<Route path='/questions' element={user ? <QuestionsPage /> : <Navigate to='/login' />} />
				<Route path='/chat' element={user ? <ChatPage /> : <Navigate to='/login' />} />
				<Route path='/most-asked' element={<MostAskedPage />} />
			</Routes>
			<Toaster />
		</>
	);
}

export default App;
