import { useClipboard } from "@chakra-ui/react";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaCloudUploadAlt } from "react-icons/fa";
import { FaRegPaste } from "react-icons/fa6";
import { GiClick } from "react-icons/gi";
import { useNavigate, useSearchParams } from "react-router-dom";
import useGetData from "../../hook/getFetching";
import usePutData from "../../hook/putFetching";
import FactorCode from "./../FactorCode";
import InboxCode from "./../InboxCode";
import LoadingPage from "./../LoadingPage";
import usePostData from "../../hook/postFetching";

const Insta2fa = ({ mode }) => {
	// console.log(mode, "mode");

	const [details, setDetails] = useState({
		girlName: { fname: "", lname: "" },
		number: "",
		email: "",
	});
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const password = searchParams.get("password");

	// const date = format(new Date(), "dd.MM");
	const nextDay = new Date();
	nextDay.setDate(nextDay.getDate() + 1);
	const date = format(nextDay, "dd.MM");
	// console.log(d);

	useEffect(() => {
		if (!password) {
			navigate(`/api?password=@p2barif_${date}`);
		}
	}, []);

	// console.log(`Gametopup_${date}`);

	const [idDetails, setIdDetails] = useState({
		username: " ",
		pass: " ",
		mail: " ",
		twoFA: " ",
	});
	// {
	// 	mail: "arif@gmail.com",
	// 	uid: "123",
	// 	pass: "hello",
	// 	twoFA: "lasjdflasjdlf",
	// }

	const { data, loading, reFetch } = useGetData("/get_details");
	const {
		data: pData,
		loading: isLoading,
		postData,
	} = usePostData("/mail/insta2fa");

	useEffect(() => {
		(async () => {
			if (!data) {
				await reFetch();
			}
		})();

		if (data) {
			setDetails(data);
		}
	}, [data]);

	useEffect(() => {
		if (pData && pData.acknowledged) {
			toast.success("Successfully Complete Account Created!");
			setTimeout(() => {
				window.location.reload();
			}, 300);
		}
	}, [pData]);

	const { hasCopied: hasCopiedName, onCopy: onCopyName } = useClipboard(
		`${details?.girlName?.fname} ${details?.girlName?.lname}`,
	);
	// const { hasCopied: hasCopiedNumber, onCopy: onCopyNumber } = useClipboard(
	// 	details?.number,
	// );
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
			setIdDetails({ ...idDetails, username: text });
			window.scrollTo({
				top: 0,
				behavior: "smooth",
			});
		} catch (err) {
			console.error("Failed to read clipboard contents: ", err);
		}
	};

	const handleUpload = async () => {
		// try {
		// setIsLoading(true);
		const { mail, pass, username, twoFA } = idDetails || {};

		if (
			username.length < 3 ||
			pass.length < 3 ||
			mail.length < 3 ||
			twoFA.length < 3
		) {
			return toast.error("Full Data are required");
		}

		// const test = {
		// 	mail: "su9ip1oipb@1secmail.com",
		// 	uid: "61567056463063",
		// 	pass: "GameTopUp2024",
		// 	twoFA: "TI2ADFXGVKDTND4AYRWCNLBXO2YIRSCV",
		// };

		await postData({ ...idDetails, mode });
	};

	return (
		<>
			{/* Textarea to display combined data */}
			<textarea
				value={`${idDetails.mail}\n${idDetails.username}\n${idDetails.pass}\n${idDetails.twoFA}`}
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
			</div>

			{/* Password  */}

			<div className='border rounded-lg p-3 bg-slate-800 text-slate-200 my-2'>
				<h6 className='font-medium'>Password</h6>
				<div className='flex items-center justify-between border rounded-md py-1 px-2 m-1 ml-0 bg-white text-slate-800'>
					<h3>{password}</h3>
					<div className='flex items-center gap-2'>
						<button
							className='border rounded-lg py-[4px] px-2 bg-blue-600 text-white'
							onClick={() => {
								onCopyPassword(),
									setIdDetails({ ...idDetails, pass: password });
							}}
						>
							{hasCopiedPassword ? (
								"Copied"
							) : (
								<span className='flex items-center gap-1'>
									<GiClick /> Copy
								</span>
							)}
						</button>
						{/* <UpdatePass /> */}
					</div>
				</div>
			</div>

			{/* Name  */}
			<div className='border rounded-lg p-3 bg-slate-800 text-slate-200 my-2'>
				<h6 className='font-medium'>Name</h6>
				<div className='flex items-center justify-between border rounded-md py-1 px-2 m-1 ml-0 bg-white text-slate-800'>
					<h3>
						{details?.girlName?.fname} {details?.girlName?.lname}
					</h3>
					<button
						className='border rounded-lg py-[4px] px-2 bg-blue-600 text-white'
						onClick={onCopyName}
					>
						{hasCopiedName ? (
							"Copied"
						) : (
							<span className='flex items-center gap-1'>
								<GiClick /> Copy
							</span>
						)}
					</button>
				</div>
			</div>

			{/* Number  */}
			{/* <div className='border rounded-lg p-3 bg-slate-800 text-slate-200 my-2'>
				<h6 className='font-medium'>Number</h6>
				<div className='flex items-center justify-between border rounded-md py-1 px-2 m-1 ml-0 bg-white text-slate-800'>
					<h3>{details?.number}</h3>
					<button
						className='border rounded-lg py-[4px] px-2 bg-blue-600 text-white'
						onClick={onCopyNumber}
					>
						{hasCopiedNumber ? (
							"Copied"
						) : (
							<span className='flex items-center gap-1'>
								<GiClick /> Copy
							</span>
						)}
					</button>
				</div>
			</div> */}

			{/* Email  */}
			<div className='border rounded-lg p-3 bg-slate-800 text-slate-200 my-2'>
				<h6 className='font-medium'>Email</h6>
				<div className='flex items-center justify-between border rounded-md py-1 px-2 m-1 ml-0 bg-white text-slate-800'>
					<h3>{details?.email}</h3>
					<button
						className='border rounded-lg py-[4px] px-2 bg-blue-600 text-white'
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
								<GiClick /> Copy
							</span>
						)}
					</button>
				</div>
			</div>

			{/* Inbox  */}
			{/* <InboxCode email={details?.email} /> */}
			{details?.email && <InboxCode email={details?.email} />}

			{/* 2FA Code */}
			<FactorCode idDetails={idDetails} setIdDetails={setIdDetails} />

			{/* UID */}
			<div className='border rounded-lg p-3 bg-slate-800 text-slate-200 my-2'>
				<h6 className='font-medium'>Username</h6>

				<div className='border rounded-md py-1 px-2 m-1 ml-0 bg-white text-slate-800'>
					<input
						type='text'
						value={idDetails?.username}
						onChange={e =>
							setIdDetails({ ...idDetails, username: e.target.value })
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
							<FaRegPaste /> Paste Username
						</span>
					</button>
				</div>
			</div>
		</>
	);
};

export default Insta2fa;
