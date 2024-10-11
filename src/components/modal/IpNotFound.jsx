import {
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalOverlay,
} from "@chakra-ui/react";
import { FaWhatsapp } from "react-icons/fa";

import React, { useState } from "react";
import img1 from "./../../assets/img1.jpg";

const IpNotFound = ({ open, setOpen }) => {
	// const [open, setOpen] = useState(false);

	return (
		<>
			{/* <Button onClick={onOpen}>Open Modal</Button> */}
			<Modal isOpen={open} onClose={() => setOpen(false)}>
				<ModalOverlay />
				<ModalContent>
					{/* <ModalHeader>Login Failed</ModalHeader> */}
					<ModalCloseButton />
					<ModalBody>
						<img src={img1} alt='' className='w-[80%] mx-auto' />

						<div className='pb-10'>
							<p className='text-center text-[17px] sm:text-md md:text-lg font-semibold text-red-600'>
								{/* YOUR IP IS NOT IN THE DATABASE */}
								IF YOU DON'T HAVE LOGIN ACCESS
							</p>
							<p className='text-center'>Please buy package</p>
							<div className='flex justify-center mt-3'>
								<a
									href='https://wa.me/8801953424319?text=I%20WANT%20TO%20BUY%20MONTHLY%20FACEBOOK%20HELPER%20PACKAGE'
									className='flex items-center gap-2 bg-green-500 text-white px-5 py-1.5 rounded-lg'
								>
									<FaWhatsapp />
									Buy Package
								</a>
							</div>
						</div>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
};

export default IpNotFound;
