import axios from "axios";
import React, { useEffect, useState } from "react";
import { TbShieldCheckered } from "react-icons/tb";
import bgImage from "./assets/fb_bg.png";
import IpNotFound from "./components/modal/IpNotFound";
import { useNavigate } from "react-router-dom";

const App = () => {
	const [myIp, setMyIp] = useState("");
	const [loading, setLoading] = useState(false);
	const [ipLoading, setIpLoading] = useState(false);
	const navigate = useNavigate();
	const [open, setOpen] = useState(false);

	const fetchIp = async () => {
		try {
			setLoading(true);
			const { data } = await axios.get(import.meta.env.VITE_IP_ADDRESS);
			setMyIp(data.ip);
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchIp();
	}, []);

	const handleCheckIP = async () => {
		try {
			setIpLoading(true);
			const { data } = await axios.get(
				`${import.meta.env.VITE_SERVER_LINK}/ip_check`,
			);

			if (data.access) {
				navigate("/api");
			}
		} catch (err) {
			console.log(err.message);

			if (err.status === 403) {
				setOpen(true);
			}
			navigate("/");
		} finally {
			setIpLoading(false);
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
			<div className='flex flex-col justify-center items-center gap-2 mt-10'>
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

				<IpNotFound open={open} setOpen={setOpen} />
			</div>
		</div>
	);
};

export default App;
