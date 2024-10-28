import {
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalOverlay,
} from "@chakra-ui/react";

import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const UpdatePass = () => {
	const [open, setOpen] = useState(false);
	const [pass, setPass] = useState("");
	const navigate = useNavigate();

	const [searchParams] = useSearchParams();
	const password = searchParams.get("password");

	useEffect(() => {
		if (password) {
			setPass(password);
		}
	}, []);

	const handleSetPassword = () => {
		navigate(`/api?password=${pass}`);
		setOpen(false);
	};

	return (
		<>
			<button
				onClick={() => setOpen(true)}
				className='border rounded-lg py-[4px] px-2'
			>
				Update
			</button>

			{/* <Button onClick={onOpen}>Open Modal</Button> */}
			<Modal isOpen={open} onClose={() => setOpen(false)}>
				<ModalOverlay />
				<ModalContent>
					{/* <ModalHeader>Login Failed</ModalHeader> */}
					<ModalCloseButton color={"white"} />
					<ModalBody className='bg-slate-800 rounded-md text-white space-y-3'>
						<h1 className='text-lg font-medium'>Update Password</h1>

						<div className='border rounded-md py-2 px-2 m-1 ml-0 bg-white text-slate-800'>
							<input
								type='text'
								value={pass}
								onChange={e => setPass(e.target.value)}
								className='w-full bg-transparent border-none outline-none'
							/>
						</div>

						<div className='flex items-center gap-2 mt-2 pb-2'>
							<button
								className='border rounded-lg py-[4px] px-3'
								onClick={handleSetPassword}
							>
								Confirm
							</button>
						</div>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
};

export default UpdatePass;
