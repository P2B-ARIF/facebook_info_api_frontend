import React, { useEffect, useState } from "react";
import bgImage from "./assets/fb_bg1.jpg";
import HistoryTable from "./components/HistoryTable";
import Complete from "./components/mode/Complete";
import Quick from "./components/mode/Quick";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useGetData from "./hook/getFetching";
import LoadingPage from "./components/LoadingPage";

const Home = () => {
	const [mode, setMode] = useState("complete");
	const [show, setShow] = useState(false);

	const complete = import.meta.env.VITE_COMPLETE_PRICE;
	const quick = import.meta.env.VITE_QUICK_PRICE;

	const { data: tData, loading, reFetch: tReFetch } = useGetData("/api/today");
	const { loading: cLoading, reFetch } = useGetData("/user_verify");

	useEffect(() => {
		(async () => {
			await tReFetch();
			await reFetch();
		})();
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
								Today - {tData?.today}
							</h3>
						</div>
						<h2 className='text-xl font-bold'>Mode</h2>
						<div className='flex items-center gap-2'>
							<button
								onClick={() => setMode("complete")}
								className={`rounded-lg py-[2px] w-full border-[1px] mt-2 ${
									mode === "complete"
										? "bg-blue-600 text-white border-blue-600"
										: "border-slate-500"
								}`}
							>
								Complete - {complete}
							</button>
							<button
								// onClick={() => setMode("quick")}
								className={`rounded-lg py-[2px] w-full border-[1px] mt-2 ${
									mode === "quick"
										? "bg-blue-600 text-white border-blue-600"
										: "border-slate-500"
								}`}
							>
								Quick - {quick}
							</button>
							<button
								onClick={() => setShow(!show)}
								className={`rounded-lg py-[2px] w-full border-[1px] mt-2 ${
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
								<HistoryTable />
							</div>
						)}
					</div>

					{mode === "complete" ? (
						<Complete mode={mode} />
					) : (
						<Quick mode={mode} />
					)}
				</div>
			</div>
		</div>
	);
};

export default Home;
