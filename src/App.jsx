import { FormControl, FormLabel, Input } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import bgImage from "./assets/fb_bg.png";
import LoadingPage from "./components/LoadingPage";
import useGetData from "./hook/getFetching";
import usePutData from "./hook/putFetching";
import Register from "./Register";

const App = () => {
	const { data, loading: cLoading, reFetch } = useGetData("/user_verify");
	const { data: logData, loading, putData } = usePutData("/auth/login");

	const [open, setOpen] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		if (data) {
			if (data?.membership) {
				navigate("/api");
			}
		} else {
			reFetch();
		}
	}, [data, navigate]);

	if (cLoading) {
		return <LoadingPage />;
	}

	const handleCheckUser = async e => {
		e.preventDefault();

		const email = e.target.email.value;
		const password = e.target.password.value;

		await putData({ email, password });
	};

	if (logData) {
		if (logData?.token) {
			localStorage.setItem("token", logData.token);
			navigate("/api");
		} else if (logData?.message) {
			toast.error(logData.message);
		}
	}

	return (
		<div
			style={{
				backgroundImage: `url(${bgImage})`,
				backgroundSize: "cover",
				backgroundPosition: "center",
				backgroundRepeat: "no-repeat",
			}}
			className='relative h-screen w-full flex justify-center items-center text-white'
		>
			<div className='flex flex-col justify-center items-center gap-2 mt-10 relative z-[50] w-full max-w-[350px] bg-blue-900 rounded-lg text-slate-100 p-3 sm:p-5 md:p-10'>
				<h3 className='font-semibold text-base md:text-lg lg:text-2xl'>
					WELLCOME!
				</h3>

				<form onSubmit={handleCheckUser} className='w-full'>
					<FormControl mt={4}>
						<FormLabel>
							<span className='font-normal'>Email</span>
						</FormLabel>
						<Input
							name='email'
							type='text'
							placeholder='Email'
							required
							focusBorderColor='blue.400'
						/>
					</FormControl>
					<FormControl mt={4}>
						<FormLabel>
							<span className='font-normal'>Password</span>
						</FormLabel>
						<Input
							name='password'
							type='password'
							placeholder='Password'
							required
							focusBorderColor='blue.400'
						/>
					</FormControl>
					<button
						type='submit'
						disabled={loading}
						className='w-full bg-primary text-white py-2 px-10 rounded-lg mt-5 font-medium text-md hover:bg-blue-800 hover:text-primary transition-all duration-200 ease-linear border hover:border-primary'
					>
						{loading ? "Loading..." : "Login"}
					</button>
				</form>

				{/* {err && <p className='text-red-500 text-sm'>{err}</p>} */}
				{/* <button onClick={() => setOpen(true)} className='hover:text-blue-200'>
					Don&apos;t have Account?
				</button>
				<IpNotFound open={open} setOpen={setOpen} /> */}

				<Register />
			</div>

			{/* <div className='flex flex-col justify-center items-center gap-2 mt-10'>
				<h3 className='font-semibold text-base md:text-lg lg:text-2xl'>
					MY IP: {loading ? "Loading..." : myIp}
				</h3>

				<button
					onClick={handleCheckIP}
					disabled={ipLoading}
					className='flex items-center gap-2 text-base md:text-lg font-medium border rounded-lg py-1.5 px-5 uppercase'
				>
					<TbShieldCheckered />
					{ipLoading ? "Loading..." : "Enter my ip"}
				</button>

				</div> */}
		</div>
	);
};

export default App;
