import { useClipboard } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaRegCopy } from "react-icons/fa";
import { IoReload } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const InboxCode = ({ email }) => {
	const [code, setCode] = useState(null);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	// const res = [
	// 	{
	// 		id: 539533784,
	// 		from: "registration@facebookmail.com",
	// 		subject: "531062 is your Facebook confirmation code",
	// 		date: "2024-10-05 19:58:01",
	// 	},
	// ];

	const handleReload = async () => {
		try {
			setLoading(true);

			const { data } = await axios.get(
				`${import.meta.env.VITE_SERVER_LINK}/check_inbox?email=${email}`,
			);
			if (data.length > 0 && data[0].subject) {
				const subject = data[0].subject;
				const match = subject.match(/\d+/);
				if (match) {
					const confirmationCode = match[0];
					setCode(confirmationCode);
					return confirmationCode;
				} else {
					console.log("No confirmation code found in subject.");
				}
			} else {
				console.log("No email data or subject found.");
			}
		} catch (err) {
			if (!err.response.data.access) {
				navigate("/");
			}

			console.error("Error fetching details", err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		const intervalId = setInterval(() => {
			handleReload();
			console.log("hi");
		}, 5000);

		return () => clearInterval(intervalId);
	}, []);

	const { hasCopied: hasCopiedEmailCode, onCopy: onCopyEmailCode } =
		useClipboard(code);

	return (
		<div className='border rounded-lg p-3 bg-slate-800 text-slate-200 my-2'>
			<h6 className='font-medium'>Verify Code</h6>
			<div className='flex items-center justify-between border rounded-md py-1 px-2 m-1 ml-0 bg-white text-slate-800'>
				{/* <h3>{code}</h3> */}
				<input type='number' defaultValue={code} placeholder='verify code' />
				<div className='flex items-center gap-2'>
					<button
						className='border rounded-lg py-[4px] px-2 bg-blue-200'
						onClick={handleReload}
					>
						{loading ? (
							"Loading.."
						) : (
							<span className='flex items-center gap-1'>
								<IoReload /> Reload
							</span>
						)}
					</button>
					<button
						className='border rounded-lg py-[4px] px-2 bg-slate-200'
						onClick={onCopyEmailCode}
					>
						{hasCopiedEmailCode ? (
							"Copied"
						) : (
							<span className='flex items-center gap-1'>
								<FaRegCopy /> Copy
							</span>
						)}
					</button>
				</div>
			</div>
		</div>
	);
};

export default InboxCode;
