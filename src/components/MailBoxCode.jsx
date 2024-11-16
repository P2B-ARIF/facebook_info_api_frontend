import { useClipboard } from "@chakra-ui/react";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaRegCopy } from "react-icons/fa";

const MailBoxCode = ({ email, mail }) => {
	const [code, setCode] = useState("");

	useEffect(() => {
		if (mail?.subject) {
			const match = mail.subject.match(/\d+/); // Extract the first numeric sequence
			if (match) {
				setCode(match[0]);
			}
		}
	}, [mail]);

	// console.log(email,'email')

	const fetchSecurityCode = useCallback(async () => {
		try {
			const [username, domain] = email.split("@");
			if (!username || !domain) {
				return toast.error("Invalid email format");
			}

			console.log(username, "username");
			const url = `https://www.1secmail.com/api/v1/?action=readMessage&login=${username}&domain=1secmail.com&id=${mail.id}`;
			const { data } = await axios.get(url);

			const securityCodeMatch = data.textBody.match(
				/Your security code is: (\d{8})/,
			);
			const securityCode = securityCodeMatch ? securityCodeMatch[1] : null;

			// console.log({securityCode, securityCodeMatch})

			if (securityCode) {
				setCode(securityCode);
			} else {
				// toast.error("No security code found in the email body");
			}
		} catch (err) {
			toast.error("Failed to load messages. Try again later.");
			console.error("Error fetching mailbox:", err.message);
		}
	}, [mail]);

	useEffect(() => {
		if (!code) {
			fetchSecurityCode();
		}
	}, [code, fetchSecurityCode]);

	// Initialize the clipboard for each individual code
	const { hasCopied, onCopy } = useClipboard(code);

	return (
		<div className='flex items-center justify-between'>
			<input
				type='text'
				value={code + "----" + mail.date.split(" ")[1]}
				readOnly
				className='bg-white text-slate-800 p-1 outline-none border rounded-md focus:outline-none'
			/>
			<button
				className='rounded-lg py-[2px] px-2 bg-slate-200 border-[1px] border-slate-500'
				onClick={onCopy}
			>
				{hasCopied ? (
					"Copied"
				) : (
					<span className='flex items-center gap-1'>
						<FaRegCopy /> Copy
					</span>
				)}
			</button>
		</div>
	);
};

export default MailBoxCode;
