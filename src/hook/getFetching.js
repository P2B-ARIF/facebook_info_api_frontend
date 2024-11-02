import axios from "axios";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const useGetData = endpoint => {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true); // Start loading as true
	const navigate = useNavigate();

	const url = useMemo(
		() => `${import.meta.env.VITE_SERVER_LINK}${endpoint}`,
		[endpoint],
	);

	const fetchData = async () => {
		setLoading(true); // Set loading to true before fetching data
		try {
			const response = await axios.get(url, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			});
			setData(response.data);

			if (response.data.membership === false) {
				localStorage.removeItem("token");
				toast.error(response?.data?.message);
				navigate("/");
			}
		} catch (err) {
			const accessDenied = err.response?.data?.access === false;
			if (accessDenied) {
				localStorage.removeItem("token");
				toast.error(err.response?.data?.message);
				navigate("/");
			} else {
				toast.error(err.response?.data?.message);
			}
			console.error("Error fetching data:", err);
		} finally {
			setLoading(false);
		}
	};

	return { data, loading, reFetch: fetchData };
};

export default useGetData;
