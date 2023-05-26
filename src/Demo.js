import React from "react";
import { Box, Flex, Heading, Stack, Text, Button, Divider, Avatar, HStack, Input, InputGroup, InputLeftElement, Menu, MenuButton, MenuDivider, MenuItem, MenuList, CircularProgress, CircularProgressLabel, VStack, Card, CardBody, CardFooter, Image, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, useToast, Table, Thead, Tbody, Tr, Th, Td, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, FormLabel, ModalFooter, Checkbox, Select, FormErrorMessage } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { firebaseConfig } from "./Firebase";
import firebase from 'firebase/compat/app';
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { useDisclosure } from "@chakra-ui/react";
import logo from "./firebase.png"


firebase.initializeApp(firebaseConfig);
const firestore = firebase.firestore();
const auth = firebase.auth();

export default function Demo() {
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [currentUser, setCurrentUser] = useState(null);
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [users, setUsers] = useState([]);
    const [editName, setEditName] = useState('');
    const [editSurname, setEditSurname] = useState('');
    const [selectedUserUid, setSelectedUserUid] = useState('');
    const [loading, setLoading] = useState(false);



    useEffect(() => {
        const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
            setCurrentUser(user);
        });
        fetchUsers();

        return () => unsubscribe();
    }, []);

    const fetchUsers = () => {
        const unsubscribe = firestore.collection('users').onSnapshot((snapshot) => {
            if (snapshot.empty) {
                return;
            }

            setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        }, (error) => {
            toast({
                title: "An error occurred.",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        });

        // Return the unsubscribe function from firestore.onSnapshot
        return unsubscribe;
    };

    const handleRegister = async (email, password) => {
        try {
            setLoading(true);
            const { user } = await firebase.auth().createUserWithEmailAndPassword(email, password);

            if (user) {
                await firestore.collection('users').doc(user.uid).set({
                    email: user.email,
                });
            }

            await firebase.auth().signOut();
            setLoading(false);

            if (user) {
                toast({
                    title: "Registration successful.",
                    description: "Successfully created a user.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
                setRegisterEmail('');
                setRegisterPassword('');
                return true;
            }
        } catch (error) {
            setLoading(false);
            toast({
                title: "An error occurred.",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    }


    const handleLogin = async (email, password) => {
        try {
            const { user } = await firebase.auth().signInWithEmailAndPassword(email, password);

            if (user) {
                toast({
                    title: "Login successful.",
                    description: "Successfully logged in.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
                setLoginEmail('');
                setLoginPassword('');
                return true;
            }
        }
        catch (error) {
            toast({
                title: "An error occurred.",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    }
    const handleLogout = async () => {
        try {
            await firebase.auth().signOut();
            if (!auth.currentUser) {
                toast({
                    title: "Successful",
                    description: "Successfully logged out.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
            }
        } catch (error) {
            toast({
                title: "An error occurred.",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
        return false;
    };

    const handleData = async (name, surname) => {
        try {
            await firestore.collection('users').doc(auth.currentUser.uid).set({
                email: auth.currentUser.email,
                name,
                surname,
            }, { merge: true });
            toast({
                title: "Success",
                description: "Data send or updated successfully.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            setName('');
            setSurname('');
        }
        catch (error) {
            toast({
                title: "An error occurred.",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    }

    const handleEditData = async (name, surname, uid) => {
        try {
            await firestore.collection('users').doc(uid).set({
                name,
                surname,
            }, { merge: true });
            toast({
                title: "Success",
                description: "Data send or updated successfully.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            setEditName('');
            setEditSurname('');
            onClose();
        }
        catch (error) {
            toast({
                title: "An error occurred.",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    }

    const handleDelete = async (selectedUserUid) => {
        try {
            await firestore.collection('users').doc(selectedUserUid).delete();
            setUsers(users.filter(user => user.id !== selectedUserUid));
            toast({
                title: "Success",
                description: "User data deleted successfully.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        }
        catch (error) {
            toast({
                title: "An error occurred.",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    }

    return (
        <Flex
            h="100vh"
            w="100%"
            py={{ base: "6", md: "2" }}
            bg="#fafafa"
            gap={5}
            overflow={'scroll'}
            justifyContent={'space-around'}
        >
            <VStack spacing={10}>
                <HStack justifyContent={'center'}>
                    <Image src={logo} maxW={{ sm: "20%", md: "10%" }}></Image>
                    <Heading size={'xl'}>
                        Firebase Demo Application
                    </Heading>

                </HStack>
                <Stack spacing={10} direction={{ base: "column", md: "row" }}>
                    <Box bg="gray.200" borderRadius={"20"} p="6" borderRightWidth={{ md: "1px" }} overflow={'scroll'} dir="">
                        <VStack spacing={3}>
                            <Heading size={'md'}>
                                Register Operations using Firebase Authentication
                            </Heading>
                            <FormControl>
                                <FormLabel>Email</FormLabel>
                                <Input bg={"#fafafa"} placeholder="Email" value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Password</FormLabel>
                                <Input bg={"#fafafa"} placeholder="*******" value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} />
                            </FormControl>
                            <Button isDisabled={registerEmail === '' || registerPassword === ''} colorScheme="green" onClick={() => {
                                handleRegister(registerEmail, registerPassword);
                            }}>Register</Button>

                        </VStack>
                    </Box>
                    <Box bg="gray.200" borderRadius={"20"} p="6" borderRightWidth={{ md: "1px" }} overflow={'scroll'} >
                        <VStack spacing={3}>
                            <Heading size={'md'}>
                                Login Operations using Firebase Authentication
                            </Heading>
                            <FormControl>
                                <FormLabel>Email</FormLabel>
                                <Input bg={"#fafafa"} placeholder="Email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Password</FormLabel>
                                <Input bg={"#fafafa"} placeholder="*******" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
                            </FormControl>
                            <HStack spacing={5}>
                                <Button isDisabled={(loginEmail === '' || loginPassword === '')} colorScheme="green" onClick={() => {
                                    handleLogin(loginEmail, loginPassword);
                                }}>Login</Button>
                                <Button isDisabled={!auth.currentUser || loading} colorScheme="red" onClick={() => {
                                    handleLogout();
                                }}>Log out</Button>
                                <Text fontWeight={'bold'}>  {auth.currentUser && auth.currentUser.email && !loading ? `Logged in as (${auth.currentUser.email})` : "No user is logged in"}</Text>
                            </HStack>

                        </VStack>
                    </Box>
                </Stack>
                <Stack spacing={10} direction={{ base: "column", md: "row" }}>
                    <Box display={auth.currentUser && auth.currentUser.email && !loading ? "" : "none"} bg="gray.200" borderRadius={"20"} p="6" borderRightWidth={{ md: "1px" }} width={"100%"} >
                        <VStack spacing={3}>
                            <Heading size={'md'}>
                                Database Operations for Current User using Cloud Firestore
                            </Heading>
                            <FormControl>
                                <FormLabel>Enter Name</FormLabel>
                                <Input bg={"#fafafa"} placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Enter Surname</FormLabel>
                                <Input bg={"#fafafa"} placeholder="Surname" value={surname} onChange={(e) => setSurname(e.target.value)} />
                            </FormControl>
                            <HStack spacing={5}>
                                <Button isDisabled={(name === '' || surname === '')} colorScheme="green" onClick={() => {
                                    handleData(name, surname);
                                }}>Submit</Button>
                            </HStack>
                        </VStack>
                    </Box>
                    <Box display={auth.currentUser && auth.currentUser.email && !loading ? "" : "none"} bg="gray.200" borderRadius={"20"} p="6" borderRightWidth={{ md: "1px" }} width={"100%"} >
                        <VStack spacing={3}>
                            <Heading size={'md'}>
                                Retrieve Users Information using Cloud Firestore
                            </Heading>
                            <Table variant="simple">
                                <Thead>
                                    <Tr>
                                        <Th>Email</Th>
                                        <Th>Name</Th>
                                        <Th>Surname</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {users.map(user => (
                                        <Tr key={user.id}>
                                            <Td>{user.email}</Td>
                                            <Td>{user.name}</Td>
                                            <Td>{user.surname}</Td>
                                            <HStack spacing={5}>
                                                <Button colorScheme="green" onClick={() => {
                                                    setSelectedUserUid(user.id)
                                                    onOpen();
                                                }}>Edit</Button>
                                                <Button colorScheme="red" onClick={() => {
                                                    handleDelete(user.id)
                                                }}>Delete</Button>
                                            </HStack>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>

                        </VStack>
                    </Box>
                </Stack>
            </VStack>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Edit Any User Data</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl>
                            <FormLabel>Name</FormLabel>
                            <Input
                                placeholder="Name"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Surname</FormLabel>
                            <Input
                                placeholder="Reply message"
                                value={editSurname}
                                onChange={(e) => setEditSurname(e.target.value)}
                            />
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button colorScheme="green" onClick={() => {
                            handleEditData(editName, editSurname, selectedUserUid);
                        }} isDisabled={editName === '' || editSurname === ''} ml={3} >Edit User Data</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Flex >
    );


}