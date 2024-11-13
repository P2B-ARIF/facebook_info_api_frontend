import {
	Button,
	FormControl,
	FormLabel,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
} from "@chakra-ui/react";
import axios from "axios";

import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Register = () => {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleRegister = async e => {
		e.preventDefault();
		const name = e.target.name.value;
		const email = e.target.email.value;
		const password = e.target.password.value;
		setLoading(true);

		if (!name || !password || !email) {
			return toast.error("Please fill all the fields");
		}

		try {
			const url = import.meta.env.VITE_SERVER_LINK;
			const { data } = await axios.post(`${url}/add-user`, {
				name,
				email,
				password,
			});
			if (data.success) {
				toast.success("User created successfully");
				navigate("/");
			}
		} catch (error) {
			console.log(error.message);
			toast.error(error.response.data.message);
		} finally {
			setLoading(false);
			setOpen(false);
		}
	};

	return (
		<>
			<Button onClick={() => setOpen(true)}>Don&apos;t have Account?</Button>
			<Modal isOpen={open} onClose={() => setOpen(false)}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Register</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<form onSubmit={handleRegister} className='w-full'>
							<FormControl mt={4}>
								<FormLabel>
									<span className='font-normal'>Name</span>
								</FormLabel>
								<Input
									name='name'
									type='text'
									placeholder='Name'
									required
									focusBorderColor='blue.400'
								/>
							</FormControl>
							<FormControl mt={4}>
								<FormLabel>
									<span className='font-normal'>Email</span>
								</FormLabel>
								<Input
									name='email'
									type='text'
									placeholder='Email'
									required
									focusBorderColor='blue.400'
								/>
							</FormControl>
							<FormControl mt={4}>
								<FormLabel>
									<span className='font-normal'>Password</span>
								</FormLabel>
								<Input
									name='password'
									type='password'
									placeholder='Password'
									required
									focusBorderColor='blue.400'
								/>
							</FormControl>
							<button
								type='submit'
								disabled={loading}
								className='w-full text-white py-2 px-10 rounded-lg mt-5 font-medium text-md bg-blue-500 hover:bg-blue-800 hover:text-primary transition-all duration-200 ease-linear border hover:border-primary'
							>
								{loading ? "Loading..." : "Register"}
							</button>
						</form>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
};

export default Register;
