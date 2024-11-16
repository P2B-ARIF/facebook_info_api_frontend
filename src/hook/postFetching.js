import axios from "axios";
import { useCallback, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const usePostData = endpoint => {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(false);
	// const [error, setError] = useState(null);/
	const navigate = useNavigate();

	// Memoize the URL
	const url = useMemo(
		() => `${import.meta.env.VITE_SERVER_LINK}${endpoint}`,
		[endpoint],
	);

	// Function to send PUT request
	const postData = useCallback(
		async payload => {
			setLoading(true);
			// console.log("hit put data", payload);
			try {
				const response = await axios.post(url, payload, {
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

				// setError(null);
			} catch (err) {
				const accessDenied = err.response?.data?.access === false;

				if (accessDenied) {
					toast.error(err.response?.data?.message);
					localStorage.removeItem("token");
					navigate("/");
				} else {
					toast.error(err.response?.data?.message);
				}
				console.error("Error updating data:", err);
			} finally {
				setLoading(false);
			}
		},
		[url, navigate],
	);

	// Return state and put function
	return { data, loading, postData };
};

export default usePostData;
