import { ChevronDownIcon, CloseIcon } from "@chakra-ui/icons";
import {
	Box,
	Button,
	Container,
	Divider,
	Flex,
	Image,
	Input,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Radio,
	RadioGroup,
	Stack,
	Text,
	Textarea,
	useColorModeValue,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { FaRegImage } from "react-icons/fa6";
import { addDoc, arrayUnion, collection, doc, updateDoc } from "firebase/firestore";
import { auth, firestore, storage } from "../../firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CreatePostPage = () => {
	const [user] = useAuthState(auth);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const [inputs, setInputs] = useState({
		title: "",
		description: "",
		postType: 1,
		studyType: "",
		country: "",
		university: "",
		image: "",
	});
	const imgRef = useRef(null);

	const [previewImage, setPreviewImage] = useState(null);
	const navigate = useNavigate();

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		const reader = new FileReader();
		reader.onloadend = () => {
			setInputs({ ...inputs, image: file });
			setPreviewImage(reader.result);
		};
		reader.readAsDataURL(file);
	};

	const handleCreatePost = async () => {
		// form validation
		if (inputs.title === "" || inputs.description === "" || inputs.postType === "" || inputs.studyType === "") {
			setError("Please fill all the fields");
			return;
		}
		setIsLoading(true);
		setError(null);
		try {
			const newPost = await addDoc(collection(firestore, "posts"), {
				postedBy: user.uid,
				title: inputs.title,
				description: inputs.description,
				postType: inputs.postType,
				studyType: inputs.studyType,
				country: inputs.country,
				university: inputs.university,
				likes: 0,
				comments: [],
				bookmarks: 0,
				createdAt: new Date(),
			});

			// Save img to storage
			const storageRef = ref(storage, "posts/" + user.uid + "/" + newPost.id);

			if (inputs.image) {
				// 'file' comes from the Blob or File API
				await uploadBytes(storageRef, inputs.image);

				const imgURL = await getDownloadURL(storageRef);

				const newPostRef = doc(firestore, "posts", newPost.id);

				await updateDoc(newPostRef, {
					image: imgURL,
				});
			}

			// add post to user's posts
			const userRef = doc(firestore, "users", user.uid);
			await updateDoc(userRef, {
				posts: arrayUnion(newPost.id),
			});

			toast.success("Post created successfully");
			navigate("/" + inputs.postType + "s");
		} catch (error) {
			console.error(error);
			setError(error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Container maxW={"container.xl"} my={10}>
			<Text fontSize={"24"}>Create a post</Text>
			<Divider my={2} />

			<Flex gap='10' alignItems={"start"} flexWrap={"wrap"}>
				<Flex
					flexDir={"column"}
					gap='4'
					flex={1}
					borderRadius={"4px"}
					bg={useColorModeValue("gray.200", "gray.900")}
					p={5}
				>
					<Input
						placeholder='Title'
						value={inputs.title}
						onChange={(e) => setInputs({ ...inputs, title: e.target.value })}
						borderColor={"gray"}
					/>
					<Textarea
						placeholder='Give some details'
						size='md'
						resize={"vertical"}
						value={inputs.description}
						onChange={(e) => setInputs({ ...inputs, description: e.target.value })}
						borderColor={"gray"}
					/>
					{/* TODO: REACT DATE-PICKER EKLENECEK */}
					<Flex gap={10}>
						<Flex flexDir={"column"} gap='2'>
							<Text fontSize={"xl"} fontWeight={"bold"}>
								Post Type
							</Text>
							<RadioGroup value={inputs.postType} onChange={(e) => setInputs({ ...inputs, postType: e })}>
								<Stack spacing={5} direction='row'>
									<Radio colorScheme='blue' value='question'>
										Question
									</Radio>
									<Radio colorScheme='blue' value='experience'>
										Experience
									</Radio>
								</Stack>
							</RadioGroup>
						</Flex>
						<Flex flexDir={"column"} gap='2'>
							<Text fontSize={"xl"} fontWeight={"bold"}>
								Study Type
							</Text>
							<RadioGroup
								value={inputs.studyType}
								onChange={(e) => setInputs({ ...inputs, studyType: e })}
							>
								<Stack spacing={5} direction='row'>
									<Radio colorScheme='blue' value='internship'>
										Internship
									</Radio>
									<Radio colorScheme='blue' value='study'>
										Study
									</Radio>
								</Stack>
							</RadioGroup>
						</Flex>
						<Flex flexDir={"column"} gap='2'>
							<Text fontSize={"xl"} fontWeight={"bold"}>
								Country
							</Text>
							<Menu>
								<MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
									{inputs.country === "" ? "Choose" : inputs.country.toUpperCase()}
								</MenuButton>
								<MenuList>
									<MenuItem minH='48px' onClick={() => setInputs({ ...inputs, country: "spain" })}>
										<Image
											boxSize='2rem'
											borderRadius='full'
											src='/spain.png'
											alt='Spain Flag'
											mr='12px'
										/>
										<span>Spain</span>
									</MenuItem>
									<MenuItem minH='40px' onClick={() => setInputs({ ...inputs, country: "germany" })}>
										<Image
											boxSize='2rem'
											borderRadius='full'
											src='/germany.png'
											alt='Germany Flag'
											mr='12px'
										/>
										<span>Germany</span>
									</MenuItem>
									<MenuItem minH='40px' onClick={() => setInputs({ ...inputs, country: "italy" })}>
										<Image
											boxSize='2rem'
											borderRadius='full'
											src='/italy.png'
											alt='Italy Flag'
											mr='12px'
										/>
										<span>Italy</span>
									</MenuItem>
								</MenuList>
							</Menu>
						</Flex>
						<Flex flexDir={"column"} gap='2'>
							<Text fontSize={"xl"} fontWeight={"bold"}>
								University
							</Text>
							<Menu>
								<MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
									{inputs.university === "" ? "Choose" : inputs.university.toUpperCase()}
								</MenuButton>
								<MenuList>
									<MenuItem
										minH='48px'
										onClick={() => setInputs({ ...inputs, university: "Universidad de Jaen" })}
									>
										<Image
											boxSize='2rem'
											borderRadius='full'
											src='/spain.png'
											alt='Spain Flag'
											mr='12px'
										/>
										<span>Universidad de Jaen</span>
									</MenuItem>
									<MenuItem
										minH='40px'
										onClick={() => setInputs({ ...inputs, university: "Universidad de Sevilla" })}
									>
										<Image
											boxSize='2rem'
											borderRadius='full'
											src='/spain.png'
											alt='Germany Flag'
											mr='12px'
										/>
										<span>Universidad de Sevilla</span>
									</MenuItem>
									<MenuItem
										minH='40px'
										onClick={() => setInputs({ ...inputs, university: "Universidad de Madird" })}
									>
										<Image
											boxSize='2rem'
											borderRadius='full'
											src='/spain.png'
											alt='Italy Flag'
											mr='12px'
										/>
										<span>Universidad de Madird</span>
									</MenuItem>
								</MenuList>
							</Menu>
						</Flex>
					</Flex>
					<Flex gap={"3"}>
						<FaRegImage size='22' cursor={"pointer"} onClick={() => imgRef.current?.click()} />
						Select Image
					</Flex>

					<input type='file' hidden ref={imgRef} onChange={handleFileChange} />

					{inputs.image && (
						<Flex justifyContent={"center"} gap={2}>
							<Image src={previewImage} borderRadius={"4px"} w={400} alt='Spain Flag' />
							<CloseIcon onClick={() => setInputs({ ...inputs, image: "" })} cursor={"pointer"} />
						</Flex>
					)}

					<Flex gap={4} justifyContent={"end"}>
						<Button colorScheme='red' size='md' variant={"outline"}>
							Cancel
						</Button>
						<Button colorScheme='whatsapp' size='md' onClick={handleCreatePost} isLoading={isLoading}>
							Post
						</Button>
					</Flex>
					{error && <Text color={"red.400"}>{error}</Text>}
				</Flex>
				<Box borderRadius={"4px"} p={5}>
					<Flex gap={3}>
						<Image src='/logo-noname.png' h={30} w={30} />
						<Text fontSize={14}>Posting to Erasmus Platform</Text>
					</Flex>
					<Divider my={2} />
					<Flex gap={3} flexDir={"column"}>
						<Text fontSize={"small"}>1. Behave like you would in real life</Text>
						<Divider />
						<Text fontSize={"small"}>2. Search for duplicates before posting</Text>
						<Divider />
						<Text fontSize={"small"}>3. Read the community’s rules</Text>
						<Divider />
					</Flex>
				</Box>
			</Flex>
		</Container>
	);
};
export default CreatePostPage;
