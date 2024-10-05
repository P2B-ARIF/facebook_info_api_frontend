import React from "react";
import { PuffLoader } from "react-spinners";

const LoadingPage = () => {
	return (
		<div className='h-screen flex items-center justify-center'>
			<PuffLoader color='#0fa0ee' size={70} />
		</div>
	);
};

export default LoadingPage;
