import { useClipboard } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaRegCopy } from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";
import bgImage from "./assets/fb_bg1.jpg";
import FactorCode from "./components/FactorCode";
import InboxCode from "./components/InboxCode";
import LoadingPage from "./components/LoadingPage";

const Home = () => {
	const [details, setDetails] = useState({
		girlName: { fname: "", lname: "" },
		number: "",
		email: "",
	});
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const [searchParams] = useSearchParams();
	const password = searchParams.get("password");

	const [combinedData, setCombinedData] = useState("");
	const [idDetails, setIdDetails] = useState({
		mail: " ",
		uid: " ",
		pass: " ",
		twoFA: " ",
	});

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
			console.error("Error fetching details", err);
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

	// Mock data for mail, uid, pass, and 2FA (replace with actual values from your state)
	// const mail = "sample@mail.com";
	// const uid = "123456789";
	// const pass = "Buser2024";
	// const twoFA = "543210";

	// Use tab separator "\t" to separate data for columns
	const combinedString = `${idDetails.mail}\t${idDetails.uid}\t${idDetails.pass}\t${idDetails.twoFA}`;
	// Clipboard functionality for copying combined data
	const { hasCopied: hasCopiedCombinedData, onCopy: onCopyCombinedData } =
		useClipboard(combinedString);

	if (loading) {
		return <LoadingPage />;
	}

	// Function to update combined data into the textarea
	const handleCombineData = () => {
		// const combinedString = `${mail},${uid},${pass},${twoFA}`;
		setCombinedData(combinedString); // Update state with the combined string
	};

	// Clipboard functionality for copying all data

	// Call this when you want to trigger the copying after data update
	const handleCopyData = () => {
		handleCombineData(); // Update the combinedData first
		onCopyCombinedData(); // Copy the combined data
	};

	const handlePaste = async () => {
		try {
			const text = await navigator.clipboard.readText();
			setIdDetails({ ...idDetails, uid: text.split("?id=")[1] }); // Paste the copied text
		} catch (err) {
			console.error("Failed to read clipboard contents: ", err);
		}
	};

	return (
		<div className='relative min-h-screen w-full'>
			<img
				src={bgImage}
				alt=''
				className='object-cover w-full h-full opacity-50 z-[1]'
			/>
			<div className='absolute top-0 left-0 z-[2] flex items-center justify-center min-h-screen w-full'>
				<div className='w-full max-w-[370px] p-5'>
					<h1 className='text-3xl font-bold mb-5'>Information Form</h1>

					{/* Textarea to display combined data */}
					<textarea
						value={`${idDetails.mail}\n${idDetails.uid}\n${idDetails.pass}\n${idDetails.twoFA}`}
						readOnly
						rows={4}
						className='border rounded-lg w-full p-2 bg-white text-slate-800 mt-2'
						placeholder='Combined data will appear here'
					/>

					{/* Button to copy all data */}
					<button
						className='rounded-lg py-[2px] px-4 bg-slate-200 border-[1px] border-slate-500 mt-2'
						onClick={handleCopyData}
					>
						{hasCopiedCombinedData ? (
							"Copied All"
						) : (
							<span className='flex items-center gap-1'>
								<FaRegCopy /> Copy All
							</span>
						)}
					</button>

					{/* Password  */}
					{password && (
						<div className='border rounded-lg p-3 bg-slate-800 text-slate-200 my-2'>
							<h6 className='font-medium'>Password</h6>
							<div className='flex items-center justify-between border rounded-md py-1 px-2 m-1 ml-0 bg-white text-slate-800'>
								<h3>{password}</h3>
								<button
									className='border rounded-lg py-[4px] px-2'
									onClick={() => {
										onCopyPassword,
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
					)}

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
									onCopyEmail,
										setIdDetails({ ...idDetails, mail: details.email });
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
								onChange={e =>
									setIdDetails({ ...idDetails, uid: e.target.value })
								}
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
				</div>
			</div>
		</div>
	);
};

export default Home;
