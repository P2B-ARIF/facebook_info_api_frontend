import { useClipboard } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaRegCopy } from "react-icons/fa";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import UpdatePass from "../modal/UpdatePass";
import FactorCode from "./../FactorCode";
import InboxCode from "./../InboxCode";
import LoadingPage from "./../LoadingPage";
import { FaCloudUploadAlt } from "react-icons/fa";
import toast from "react-hot-toast";

const Complete = ({ mode }) => {
	// console.log(mode, "mode");

	const [details, setDetails] = useState({
		girlName: { fname: "", lname: "" },
		number: "",
		email: "",
	});
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(false);

	const [searchParams] = useSearchParams();
	const password = searchParams.get("password");
	const location = useLocation();

	useEffect(() => {
		if (!password) {
			navigate(`/api?password=GameTopUp2024`);
		}
	}, []);

	const [idDetails, setIdDetails] = useState({
		mail: " ",
		uid: " ",
		pass: " ",
		twoFA: " ",
	});
	// {
	// 	mail: "arif@gmail.com",
	// 	uid: "123",
	// 	pass: "hello",
	// 	twoFA: "lasjdflasjdlf",
	// }

	const getDetails = async () => {
		try {
			setLoading(true);
			const res = await axios.get(
				`${import.meta.env.VITE_SERVER_LINK}/get_details`,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("token")}`,
					},
				},
			);
			setDetails(res.data);
		} catch (err) {
			if (!err.response.data.access) {
				navigate("/");
			}
			// console.error("Error fetching details", err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		getDetails(); // Fetch details on component load
	}, []);

	const { hasCopied: hasCopiedName, onCopy: onCopyName } = useClipboard(
		`${details?.girlName?.fname} ${details?.girlName?.lname}`,
	);
	const { hasCopied: hasCopiedNumber, onCopy: onCopyNumber } = useClipboard(
		details?.number,
	);
	const { hasCopied: hasCopiedEmail, onCopy: onCopyEmail } = useClipboard(
		details.email,
	);
	const { hasCopied: hasCopiedPassword, onCopy: onCopyPassword } =
		useClipboard(password);

	if (loading) {
		return <LoadingPage />;
	}

	const handlePaste = async () => {
		try {
			const text = await navigator.clipboard.readText();
			if (!text) return;
			setIdDetails({ ...idDetails, uid: text.match(/id=(\d+)/)?.[1] }); // Paste the copied text
		} catch (err) {
			console.error("Failed to read clipboard contents: ", err);
		}
	};

	const handleUpload = async () => {
		try {
			setIsLoading(true);
			const { mail, pass, uid, twoFA } = idDetails || {};

			if (
				mail.length < 3 ||
				pass.length < 3 ||
				uid.length < 3 ||
				twoFA.length < 3
			) {
				return toast.error("Full Data are required");
			}

			const { data } = await axios.put(
				`${import.meta.env.VITE_SERVER_LINK}/mail/complete`,
				{ ...idDetails, mode },
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("token")}`,
					},
				},
			);

			if (data.acknowledged) {
				toast.success("Successfully Complete Account Created!");
				setTimeout(() => {
					window.location.reload();
				}, 300);
			}
		} catch (error) {
			toast.error(error.message);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			{/* Textarea to display combined data */}
			<textarea
				value={`${idDetails.mail}\n${idDetails.uid}\n${idDetails.pass}\n${idDetails.twoFA}`}
				readOnly
				rows={4}
				className='border rounded-lg w-full p-2 bg-white border-blue-600 text-slate-800 mt-2'
				placeholder='Combined data will appear here'
			/>

			{/* Button to copy all data */}
			<div className='flex items-center gap-2'>
				<button
					className='flex items-center gap-2 rounded-lg py-[2px] px-4 bg-green-600 border-[1px] border-green-700 text-white mt-1 mb-2'
					onClick={handleUpload}
					disabled={isLoading}
				>
					{isLoading ? (
						"Loading..."
					) : (
						<>
							<FaCloudUploadAlt /> Upload
						</>
					)}
				</button>

				{/* <button
					className='rounded-lg py-[2px] px-4 bg-slate-200 border-[1px] border-slate-500 mt-2'
					onClick={handleCopyDataPc}
				>
					{hasCopiedCombinedDataPc ? (
						"Copied All"
					) : (
						<span className='flex items-center gap-1'>
							<FaRegCopy /> Pc Copy
						</span>
					)}
				</button>
				<button
					className='rounded-lg py-[2px] px-4 bg-slate-200 border-[1px] border-slate-500 mt-2'
					onClick={handleCopyDataMobile}
				>
					{hasCopiedCombinedDataMobile ? (
						"Copied All"
					) : (
						<span className='flex items-center gap-1'>
							<FaRegCopy /> Mobile Copy
						</span>
					)}
				</button> */}
			</div>

			{/* Password  */}

			<div className='border rounded-lg p-3 bg-slate-800 text-slate-200 my-2'>
				<h6 className='font-medium'>Password</h6>
				<div className='flex items-center justify-between border rounded-md py-1 px-2 m-1 ml-0 bg-white text-slate-800'>
					<h3>{password}</h3>
					<div className='flex items-center gap-2'>
						<button
							className='border rounded-lg py-[4px] px-2'
							onClick={() => {
								onCopyPassword(),
									setIdDetails({ ...idDetails, pass: password });
							}}
						>
							{hasCopiedPassword ? (
								"Copied"
							) : (
								<span className='flex items-center gap-1'>
									<FaRegCopy /> Copy
								</span>
							)}
						</button>
						<UpdatePass />
					</div>
				</div>
			</div>

			{/* {password && (
				<div className='border rounded-lg p-3 bg-slate-800 text-slate-200 my-2'>
					<h6 className='font-medium'>Password</h6>
					<div className='flex items-center justify-between border rounded-md py-1 px-2 m-1 ml-0 bg-white text-slate-800'>
						<h3>{password}</h3>
						<button
							className='border rounded-lg py-[4px] px-2'
							onClick={() => {
								onCopyPassword(),
									setIdDetails({ ...idDetails, pass: password });
							}}
						>
							{hasCopiedPassword ? (
								"Copied"
							) : (
								<span className='flex items-center gap-1'>
									<FaRegCopy /> Copy
								</span>
							)}
						</button>
					</div>
				</div>
			)} */}

			{/* Name  */}
			<div className='border rounded-lg p-3 bg-slate-800 text-slate-200 my-2'>
				<h6 className='font-medium'>Name</h6>
				<div className='flex items-center justify-between border rounded-md py-1 px-2 m-1 ml-0 bg-white text-slate-800'>
					<h3>
						{details?.girlName?.fname} {details?.girlName?.lname}
					</h3>
					<button
						className='border rounded-lg py-[4px] px-2'
						onClick={onCopyName}
					>
						{hasCopiedName ? (
							"Copied"
						) : (
							<span className='flex items-center gap-1'>
								<FaRegCopy /> Copy
							</span>
						)}
					</button>
				</div>
			</div>

			{/* Number  */}
			<div className='border rounded-lg p-3 bg-slate-800 text-slate-200 my-2'>
				<h6 className='font-medium'>Number</h6>
				<div className='flex items-center justify-between border rounded-md py-1 px-2 m-1 ml-0 bg-white text-slate-800'>
					<h3>{details?.number}</h3>
					<button
						className='border rounded-lg py-[4px] px-2'
						onClick={onCopyNumber}
					>
						{hasCopiedNumber ? (
							"Copied"
						) : (
							<span className='flex items-center gap-1'>
								<FaRegCopy /> Copy
							</span>
						)}
					</button>
				</div>
			</div>

			{/* Email  */}
			<div className='border rounded-lg p-3 bg-slate-800 text-slate-200 my-2'>
				<h6 className='font-medium'>Email</h6>
				<div className='flex items-center justify-between border rounded-md py-1 px-2 m-1 ml-0 bg-white text-slate-800'>
					<h3>{details?.email}</h3>
					<button
						className='border rounded-lg py-[4px] px-2'
						// onClick={onCopyEmail}
						onClick={() => {
							setIdDetails({ ...idDetails, mail: details.email }),
								onCopyEmail();
						}}
					>
						{hasCopiedEmail ? (
							"Copied"
						) : (
							<span className='flex items-center gap-1'>
								<FaRegCopy /> Copy
							</span>
						)}
					</button>
				</div>
			</div>

			{/* Inbox  */}
			<InboxCode email={details?.email} />

			{/* 2FA Code */}
			<FactorCode idDetails={idDetails} setIdDetails={setIdDetails} />

			{/* UID */}
			<div className='border rounded-lg p-3 bg-slate-800 text-slate-200 my-2'>
				<h6 className='font-medium'>UID</h6>

				<div className='border rounded-md py-1 px-2 m-1 ml-0 bg-white text-slate-800'>
					<input
						type='text'
						value={idDetails?.uid}
						onChange={e => setIdDetails({ ...idDetails, uid: e.target.value })}
						className='w-full bg-transparent border-none outline-none'
					/>
				</div>

				<div className='flex items-center gap-2 mt-2'>
					<button
						className='border rounded-lg py-[4px] px-3'
						onClick={handlePaste}
					>
						<span className='flex items-center gap-1'>
							<FaRegCopy /> Paste Url
						</span>
					</button>
				</div>
			</div>
		</>
	);
};

export default Complete;
