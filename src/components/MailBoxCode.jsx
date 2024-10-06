import { useClipboard } from "@chakra-ui/react";
import React from "react";
import { FaRegCopy } from "react-icons/fa";

const MailBoxCode = ({ mail }) => {
	// Extract the code from the subject
	const match = mail.subject.match(/\d+/);
	const code = match ? match[0] : "";

	// Initialize the clipboard for each individual code
	const { hasCopied, onCopy } = useClipboard(code);

	return (
		<div className='flex items-center justify-between'>
			<input
				type='text'
				value={code + "----" +  mail.date.split(" ")[1]}
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
