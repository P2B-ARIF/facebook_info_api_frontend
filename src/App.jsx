import axios from "axios";
import React, { useEffect, useState } from "react";
import { TbShieldCheckered } from "react-icons/tb";
import bgImage from "./assets/fb_bg.png";
import IpNotFound from "./components/modal/IpNotFound";
import { useNavigate } from "react-router-dom";
import { FormControl, FormLabel, Input } from "@chakra-ui/react";

const App = () => {
	// const [myIp, setMyIp] = useState("");
	const [loading, setLoading] = useState(false);
	// const [ipLoading, setIpLoading] = useState(false);
	const navigate = useNavigate();
	const [open, setOpen] = useState(false);
	const [err, setErr] = useState("");

	// const fetchIp = async () => {
	// 	try {
	// 		setLoading(true);
	// 		const { data } = await axios.get(import.meta.env.VITE_IP_ADDRESS);
	// 		setMyIp(data.ip);
	// 	} catch (err) {
	// 		console.error(err);
	// 	} finally {
	// 		setLoading(false);
	// 	}
	// };

	// useEffect(() => {
	// 	fetchIp();
	// }, []);

	const checkUser = async () => {
		try {
			const { data } = await axios.get(
				`${import.meta.env.VITE_SERVER_LINK}/user_verify`,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("token")}`,
					},
				},
			);

			if (data.access) {
				navigate("/api");
			}
		} catch (err) {
			console.log(err.message);
			if (!err.response.data.access) {
				setOpen(true);
			}
			navigate("/");
		}
	};

	useEffect(() => {
		checkUser();
	}, []);

	const handleCheckUser = async e => {
		e.preventDefault();

		const email = e.target.email.value;
		const password = e.target.password.value;

		try {
			setLoading(true);
			const { data } = await axios.put(
				`${import.meta.env.VITE_SERVER_LINK}/auth/login`,
				{ email, password },
			);

			if (data.access) {
				localStorage.setItem("token", data.token);
				navigate("/api");
			} else {
				console.log("Access denied.");
				setOpen(true);
				navigate("/");
			}
		} catch (err) {
			console.error("Login error:", err.message);
			setErr(err.response.message);
			if (err.response && err.response.data && !err.response.data.access) {
				setOpen(true); // Open some error UI (modal or alert)
			} else {
				console.log("Unknown error occurred.");
			}
			navigate("/"); // Fallback to home navigation
		} finally {
			setLoading(false); // Stop loading in the end
		}
	};

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
							type='email'
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

				{err && <p className='text-red-500 text-sm'>{err}</p>}
				<button onClick={() => setOpen(true)} className='hover:text-blue-200'>
					Don&apos;t have Account?
				</button>
				<IpNotFound open={open} setOpen={setOpen} />
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
