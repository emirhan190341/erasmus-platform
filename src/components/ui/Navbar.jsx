import {
	Box,
	Flex,
	Avatar,
	HStack,
	IconButton,
	Button,
	Menu,
	MenuButton,
	useDisclosure,
	useColorModeValue,
	Stack,
	Image,
	MenuList,
	MenuItem,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon, RepeatIcon, EditIcon } from "@chakra-ui/icons";
import { Link as RouterLink } from "react-router-dom";
import { MdLogout } from "react-icons/md";
import { useAuthState, useSignOut } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/firebase";
import { FaUserCircle } from "react-icons/fa";
import { IoIosCreate } from "react-icons/io";

// const Links = ["Most Asked", "Projects", "Team"];

const LINKS = [
	{
		name: "Experiences",
		to: "/experiences",
	},
	{
		name: "Questions",
		to: "/questions",
	},
	{
		name: "Most Asked",
		to: "/most-asked",
	},
	{
		name: "Messages",
		to: "/chat",
	},
];

const NavLink = ({ link }) => {
	return (
		<Box
			as={RouterLink}
			px={2}
			py={1}
			rounded={"md"}
			_hover={{
				textDecoration: "none",
				bg: useColorModeValue("gray.200", "gray.700"),
			}}
			to={link?.to}
		>
			{link?.name}
		</Box>
	);
};

const Navbar = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [signOut] = useSignOut(auth);
	const [user] = useAuthState(auth);

	return (
		<Box bg={useColorModeValue("gray.100", "gray.900")}>
			<Box maxW={"container.xl"} mx='auto' px={4}>
				<Flex h={32} alignItems={"center"} justifyContent={"space-between"}>
					<IconButton
						size={"md"}
						icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
						aria-label={"Open Menu"}
						display={{ md: "none" }}
						onClick={isOpen ? onClose : onOpen}
					/>
					<HStack spacing={8} alignItems={"center"}>
						<RouterLink to={"/"}>
							<Image src='/logo.png' height={50} />
						</RouterLink>
						<HStack as={"nav"} spacing={4} display={{ base: "none", md: "flex" }}>
							{LINKS.map((link, idx) => (
								<NavLink key={idx} link={link} />
							))}
						</HStack>
					</HStack>
					<Flex alignItems={"center"} gap={4}>
						<Flex rounded={"full"} variant={"link"} cursor={"pointer"} minW={0} alignItems={"center"}>
							{/* <Avatar
								size={"md"}
								src={
									"https://images.unsplash.com/photo-1493666438817-866a91353ca9?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9"
								}
								mx={3}
							/> */}
							<Menu>
								{user && (
									<MenuButton
										as={IconButton}
										bg={"transparent"}
										borderRadius={"full"}
										_hover={{ bg: "transparent" }}
										_focus={{ bg: "transparent" }}
										_active={{ bg: "transparent" }}
										aria-label='Options'
										icon={
											<Avatar
												src={
													user?.photoURL ||
													"https://images.unsplash.com/photo-1493666438817-866a91353ca9?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9"
												}
												mx={3}
												border={"1px solid"}
												transition={"transform 0.3s ease"}
												_hover={{
													transform: "scale(1.05)",
												}}
											/>
										}
										border={"none"}
										variant='outline'
									/>
								)}

								<MenuList>
									<RouterLink to={`/profile/${user?.uid}`}>
										<MenuItem icon={<FaUserCircle size={20} />}>My Profile</MenuItem>
									</RouterLink>

									<RouterLink to={`/create`}>
										<MenuItem icon={<IoIosCreate size={20} />}>Create Post</MenuItem>
									</RouterLink>
									<MenuItem icon={<RepeatIcon />}>Open Closed Tab</MenuItem>
									<MenuItem icon={<EditIcon />}>Open File...</MenuItem>
								</MenuList>
							</Menu>
						</Flex>
						<Stack
							flex={{ base: 1, md: 0 }}
							justify={"flex-end"}
							direction={"row"}
							spacing={6}
							alignItems={"center"}
							cursor={"pointer"}
						>
							{!user && <NavbarAuthLinks />}

							<MdLogout size={25} onClick={signOut} />
						</Stack>
					</Flex>
				</Flex>

				{isOpen ? (
					<Box pb={4} display={{ md: "none" }}>
						<Stack as={"nav"} spacing={4}>
							{LINKS.map((link) => (
								<NavLink key={link.name} link={link} />
							))}
						</Stack>
					</Box>
				) : null}
			</Box>
		</Box>
	);
};
export default Navbar;

function NavbarAuthLinks() {
	return (
		<>
			<Button as={RouterLink} fontSize={"sm"} ml={3} fontWeight={400} variant={"link"} to={"/login"}>
				Sign In
			</Button>
			<Button
				as={RouterLink}
				display={{ base: "none", md: "inline-flex" }}
				fontSize={"sm"}
				fontWeight={600}
				color={"white"}
				bg={"blue.400"}
				to={"/signup"}
				_hover={{
					bg: "blue.300",
				}}
			>
				Sign Up
			</Button>
		</>
	);
}
