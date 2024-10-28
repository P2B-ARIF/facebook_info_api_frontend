import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { format } from "date-fns";

const HistoryTable = () => {
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState([]);

	const fetchingHistory = async () => {
		setLoading(true);
		try {
			const { data } = await axios.get(
				`${import.meta.env.VITE_SERVER_LINK}/api/table`,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("token")}`,
					},
				},
			);

			setData(data);
		} catch (error) {
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchingHistory();
	}, []);

	const complete = import.meta.env.VITE_COMPLETE_PRICE;
	const quick = import.meta.env.VITE_QUICK_PRICE;

	// const data = Array.from({ length: 12 }, (_, index) => ({
	// 	date: `${(index + 1).toString().padStart(2, "0")}/10`, // Month is set as "10", incrementing day
	// 	c: Math.floor(Math.random() * 10) + 1,
	// 	q: Math.floor(Math.random() * 5) + 1,
	// 	result_c: Math.floor(Math.random() * 20) + 5,
	// 	result_q: Math.floor(Math.random() * 5) + 1,
	// 	total: Math.floor(Math.random() * 100) + 1,
	// }));

	return (
		<div>
			<Table size='sm'>
				<Thead>
					<Tr className='bg-white'>
						<Th>Date</Th>
						<Th>C</Th>
						<Th>Q</Th>
						<Th>
							<h4 className='flex items-center gap-1'>
								<IoIosCheckmarkCircle /> C
							</h4>
						</Th>
						<Th>
							<h4 className='flex items-center gap-1'>
								<IoIosCheckmarkCircle /> Q
							</h4>
						</Th>
						<Th isNumeric>Total</Th>
					</Tr>
				</Thead>
				<Tbody>
					{data &&
						data.map((item, i) => {
							const total =
								Number(item.approvedComplete * complete) +
								Number(item.approvedQuick * quick);

							return (
								<Tr key={i}>
									<Td>{format(new Date(item.date), "MM/dd")}</Td>
									<Td>{item.complete}</Td>
									<Td>{item.quick}</Td>
									<Td>{item.approvedComplete}</Td>
									<Td>{item.approvedQuick}</Td>
									<Td isNumeric fontWeight={"bold"}>{total.toFixed(2)}</Td>
								</Tr>
							);
						})}
				</Tbody>
			</Table>
		</div>
	);
};

export default HistoryTable;
