import axios from "axios";
import React, { useEffect, useState } from "react";
import { IoReload } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import MailBoxCode from "./MailBoxCode";

const InboxCode = ({ email }) => {
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const [mailbox, setMailbox] = useState([]);

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

			// const email1 = "hejozv@1secmail.com";
			// const email1 = "hd057l@1secmail.com";
			console.log();

			const { data } = await axios.get(
				`${import.meta.env.VITE_SERVER_LINK}/check_inbox?email=${email}`,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("token")}`,
					},
				},
			);
			setMailbox(data);
		} catch (err) {
			if (err.response && !err.response.data.access) {
				navigate("/");
			}
			console.error("Error fetching details", err.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		const intervalId = setInterval(() => {
			handleReload();
		}, 10000);

		return () => clearInterval(intervalId);
	}, []);

	// const { hasCopied: hasCopiedEmailCode, onCopy: onCopyEmailCode } =
	// 	useClipboard(code);

	return (
		<div className='border rounded-lg p-3 bg-slate-800 text-slate-200 my-2'>
			<div className='flex items-center justify-between'>
				<h6 className='font-medium'>Verify Code</h6>
				<button
					disabled={loading}
					className='border rounded-lg py-[4px] px-2 bg-slate-200 text-black'
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
			</div>
			{/* <div className='flex items-center justify-between border rounded-md py-1 px-2 m-1 ml-0 bg-white text-slate-800'> */}
			{/* <div className=' border rounded-md py-1 px-2 m-1 ml-0 bg-white text-slate-800'> */}
			<div className='bg-white text-slate-800 border rounded-md p-2 flex flex-col gap-2 mt-2'>
				{mailbox.length > 0 ? (
					mailbox?.map((mail, i) => <MailBoxCode key={i} mail={mail} />)
				) : (
					<input
						type='text'
						placeholder='No verification code available'
						readOnly
						className='bg-white text-slate-800 border p-2 rounded'
					/>
				)}
			</div>
		</div>
	);
};

export default InboxCode;
