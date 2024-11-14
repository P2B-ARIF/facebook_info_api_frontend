import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { IoReload } from "react-icons/io5";
import MailBoxCode from "./MailBoxCode";

const InboxCode = ({ email }) => {
	const [loading, setLoading] = useState(false);
	const [mailbox, setMailbox] = useState([]);

	const fetchMailbox = useCallback(async () => {
		setLoading(true);
		try {
			const [username, domain] = email.split("@");
			if (!username || !domain) {
				toast.error("Invalid email format");
				return;
			}

			const url = `https://www.1secmail.com/api/v1/?action=getMessages&login=${username}&domain=${domain}`;
			const { data } = await axios.get(url);
			setMailbox(data);
		} catch (err) {
			toast.error("Failed to load messages. Try again later.");
			console.error("Error fetching mailbox:", err.message);
		} finally {
			setLoading(false);
		}
	}, [email]);

	useEffect(() => {
		const intervalId = setInterval(() => {
			fetchMailbox();
		}, 5000);

		return () => clearInterval(intervalId);
	}, [fetchMailbox]);

	const handleManualReload = () => {
		if (!loading) fetchMailbox();
	};

	return (
		<div className='border rounded-lg p-3 bg-slate-800 text-slate-200 my-2'>
			<div className='flex items-center justify-between'>
				<h6 className='font-medium'>Email Verify Code</h6>
				<button
					disabled={loading}
					className='border rounded-lg py-[4px] px-2 bg-slate-200 text-black'
					onClick={handleManualReload}
				>
					{loading ? (
						"Loading..."
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
