import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Demo = () => {
	const navigate = useNavigate();

	const allIP = async () => {
		try {
			const { data } = await axios.get(
				`${import.meta.env.VITE_SERVER_LINK}/api/v2/all_ip`,
			);
			console.log(data, "res");
		} catch (err) {
			if (!err.response.data.access) {
				navigate("/");
			}
			console.error("Error fetching details", err);
		}
	};

	useEffect(() => {
		allIP();
	}, []);

	return <div>Demo</div>;
};

export default Demo;
