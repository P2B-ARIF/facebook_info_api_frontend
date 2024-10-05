import React, { useEffect, useState } from "react";
import bgImage from "./assets/fb_bg1.jpg";
import axios from "axios";
import { Button, useClipboard, useQuery } from "@chakra-ui/react";
import LoadingPage from "./components/LoadingPage";
import { FaRegCopy } from "react-icons/fa";
import InboxCode from "./components/InboxCode";
import FactorCode from "./components/FactorCode";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

const Home = () => {
	const [details, setDetails] = useState({
		girlName: { fname: "", lname: "" },
		number: "",
		email: "",
	});
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate()

	const [searchParams] = useSearchParams();
	const password = searchParams.get("password");

	const getDetails = async () => {
		try {
			setLoading(true);
			const res = await axios.get(
				`${import.meta.env.VITE_SERVER_LINK}/get_details`,
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

	if (loading) {
		return <LoadingPage />;
	}

	return (
		<div className='relative min-h-screen w-full'>
			<img
				src={bgImage}
				alt=''
				className='object-cover w-full h-full opacity-50 z-[1]'
			/>
			<div className='absolute top-0 left-0 z-[2] flex items-center justify-center min-h-screen w-full'>
				<div className='max-w-[350px]'>
					<h1 className='text-3xl font-bold mb-5'>Information Form</h1>

					{/* Password  */}
					{password && (
						<div className='border rounded-lg p-3 bg-slate-800 text-slate-200 my-2'>
							<h6 className='font-medium'>Password</h6>
							<div className='flex items-center justify-between border rounded-md py-1 px-2 m-1 ml-0 bg-white text-slate-800'>
								<h3>{password}</h3>
								<button
									className='border rounded-lg py-[4px] px-2'
									onClick={onCopyPassword}
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
								onClick={onCopyEmail}
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
					<FactorCode />
				</div>
			</div>
		</div>
	);
};

export default Home;
