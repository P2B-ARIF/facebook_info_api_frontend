import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "./assets/fb_bg1.jpg";
import HistoryTable from "./components/HistoryTable";
import LoadingPage from "./components/LoadingPage";
import Complete from "./components/mode/Complete";
import Quick from "./components/mode/Quick";
import useGetData from "./hook/getFetching";
import Insta2fa from "./components/mode/Insta2fa";

const Home = () => {
// 	return (
// 		<div className="bg-blue-500 h-screen w-full flex items-center justify-center">
// 			<h1 className="font-bold text-lg text-center">
// 				ওয়েবসাইট সংস্কার কাজ চলতেছে। ১৭তারিখ থেকে আবার কাজ করতে পারবেন।
// 				দয়া করে অপেক্ষা করুন।
// 			</h1>
// 		</div>
// 	);
// };

	const [mode, setMode] = useState("complete");
	const [show, setShow] = useState(false);
	const navigate = useNavigate();

	const complete = import.meta.env.VITE_COMPLETE_PRICE;
	const insta2fa = import.meta.env.VITE_INSTA2FA;

	const { data: tData, loading, reFetch: tReFetch } = useGetData("/api/today");
	const { loading: cLoading, reFetch } = useGetData("/user_verify");

// console.log(tData, 'data')

	// const date = format(new Date(), "dd.MM");
	const nextDay = new Date();
	nextDay.setDate(nextDay.getDate() + 1);
	const date = format(nextDay, "dd.MM");

	useEffect(() => {
		(async () => {
			await tReFetch();
			await reFetch();
		})();

		navigate(`/api?password=@p2barif_${date}`);
	}, []);

	if (cLoading) {
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
				<div className='w-full max-w-[370px] p-5 px-2'>
					<div className='bg-slate-800 text-white transition-all duration-300 ease-linear p-3 rounded-lg border-blue-500 border'>
						<div className='flex items-center justify-between'>
							<h3 className='text-xl font-medium mb-5'>Dashboard</h3>
							<h3 className='text-xl font-medium mb-5'>
								Today -{" "}
								{mode === "complete" ? tData?.facebook : tData?.instagram}
							</h3>
						</div>
						<h2 className='text-xl font-bold'>Mode</h2>
						<div className='grid grid-cols-2 items-center gap-2 mt-2'>
							<button
								onClick={() => setMode("complete")}
								className={`rounded-lg py-[2px] w-full border-[1px] ${
									mode === "complete"
										? "bg-blue-600 text-white border-blue-600"
										: "border-slate-500"
								}`}
							>
								Complete - {complete} TK
							</button>
							<button
								onClick={() => setMode("insta2fa")}
								className={`rounded-lg py-[2px] w-full border-[1px] ${
									mode === "insta2fa"
										? "bg-blue-600 text-white border-blue-600"
										: "border-slate-500"
								}`}
							>
								Insta2FA - {insta2fa} TK
							</button>
							<button
								onClick={() => setShow(!show)}
								className={`rounded-lg py-[2px] w-full border-[1px] ${
									show
										? "bg-green-600 text-white border-green-600"
										: "border-slate-500"
								}`}
							>
								History
							</button>
						</div>

						{show && (
							<div className='mt-2 space-y-2'>
								<h2 className='text-lg font-medium text-center'>
									History & Report Table
								</h2>
								<HistoryTable mode={mode} />
							</div>
						)}
					</div>

					{mode === "complete" ? (
						<Complete mode={mode} />
					) : mode === "insta2fa" ? (
						<Insta2fa mode={mode} />
					) : (
						<Quick mode={mode} />
					)}
				</div>
			</div>
		</div>
	);
};

export default Home;
