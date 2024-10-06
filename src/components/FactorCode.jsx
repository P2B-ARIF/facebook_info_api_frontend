import { useClipboard } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaRegCopy } from "react-icons/fa";

const FactorCode = ({ idDetails, setIdDetails }) => {
	const [code, setCode] = useState("");
	const [loading, setLoading] = useState(false);
	const [inputValue, setInputValue] = useState(""); // Initialize with email

	const handleFactorCode = async () => {
		try {
			setCode("");
			setLoading(true);
			const res = await axios.get(
				`${
					import.meta.env.VITE_SERVER_LINK
				}/get_2fa_code?key=${inputValue.trim()}`,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("token")}`,
					},
				},
			);
			setInputValue(res.data);
		} catch (err) {
			console.error("Error fetching details", err.message);
		} finally {
			setLoading(false);
		}
	};

	const { hasCopied: hasCopiedFactorCode, onCopy: onCopyFactorCode } =
		useClipboard(code);

	const handlePaste = async () => {
		try {
			const text = await navigator.clipboard.readText();
			setInputValue(text); // Paste the copied text
			setIdDetails({ ...idDetails, twoFA: text });
		} catch (err) {
			console.error("Failed to read clipboard contents: ", err);
		}
	};

	return (
		<div className='border rounded-lg p-3 bg-slate-800 text-slate-200 my-2'>
			<h6 className='font-medium'>2FA Verification</h6>

			<div className='border rounded-md py-1 px-2 m-1 ml-0 bg-white text-slate-800'>
				<input
					type='text'
					value={inputValue}
					onChange={e => setInputValue(e.target.value)}
					className='w-full bg-transparent border-none outline-none'
				/>
			</div>

			<div className='flex items-center gap-2 mt-2'>
				<button
					className='border rounded-lg py-[4px] px-3'
					onClick={handlePaste}
				>
					<span className='flex items-center gap-1'>
						<FaRegCopy /> Paste
					</span>
				</button>
				<button
					className='border rounded-lg py-[4px] px-3'
					onClick={handleFactorCode}
				>
					<span className='flex items-center gap-1'>
						{loading ? "Loading..." : "Submit"}
					</span>
				</button>

				<button
					className='border rounded-lg py-[4px] px-3'
					onClick={onCopyFactorCode}
				>
					{hasCopiedFactorCode ? (
						"Copied"
					) : (
						<span className='flex items-center gap-1'>
							<FaRegCopy /> Copy
						</span>
					)}
				</button>
			</div>
		</div>
	);
};

export default FactorCode;
