import React, { useEffect, useState } from "react";
import { Box, Button, Input, Heading, useClipboard } from "@chakra-ui/react";
import axios from "axios";
import LoadingPage from "./components/LoadingPage";

const App = () => {
	const [details, setDetails] = useState({
		girlName: { fname: "", lname: "" },
		number: "",
		email: "",
	});
	const [loading, setLoading] = useState(false);
	const [mailCode, setMailCode] = useState(0);

	const getDetails = async () => {
		try {
			setLoading(true);
			const res = await axios.get("http://localhost:5001/get_details");
			setDetails(res.data);
		} catch (err) {
			console.error("Error fetching details", err);
		} finally {
			setLoading(false);
		}
	};
	// Check inbox
	const handleCheckCode = async () => {
		try {
			const res = await axios.get(
				`http://localhost:5001/check_inbox?email=${email}`,
			);
			setMailCode(res.data);
		} catch (err) {
			console.error("Error checking inbox", err);
		}
	};

	useEffect(() => {
		getDetails();
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

	if (loading) {
		return <LoadingPage />;
	}

	return (
		<Box maxW='md' mx='auto' mt={10}>
			<h1 className='my-6 font-bold text-lg'>Unlimited Facebook</h1>

			{/* Name Input */}
			<Box mb={4} display={"flex"} alignItems={"center"}>
				<Input
					value={`${details?.girlName?.fname} ${details.girlName.lname}`}
					isReadOnly
				/>
				<Button
					colorScheme='teal'
					size='md'
					paddingX={7}
					onClick={onCopyName}
					ml={2}
				>
					{hasCopiedName ? "Copied" : "Copy Name"}
				</Button>
			</Box>

			{/* Phone Number Input */}
			<Box mb={4} display={"flex"} alignItems={"center"}>
				<Input value={details.number} isReadOnly />
				<Button
					colorScheme='teal'
					size='md'
					paddingX={7}
					onClick={onCopyNumber}
					ml={2}
				>
					{hasCopiedNumber ? "Copied" : "Copy Number"}
				</Button>
			</Box>

			{/* Email Input */}
			<Box mb={4} display={"flex"} alignItems={"start"}>
				<Input value={details.email} isReadOnly />
				<div className='flex flex-col items-center justify-stretch gap-2'>
					<Button
						colorScheme='teal'
						size='md'
						paddingX={7}
						onClick={onCopyEmail}
						ml={2}
					>
						{hasCopiedEmail ? "Copied" : "Copy Email"}
					</Button>
					<Button
						colorScheme='teal'
						size='md'
						paddingX={"26px"}
						onClick={handleCheckCode}
						ml={2}
					>
						Check Code
					</Button>
				</div>
			</Box>
		</Box>
	);
};

export default App;
