import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { format } from "date-fns";
import useGetData from "../hook/getFetching";

const HistoryTable = () => {
	const { data, loading, reFetch } = useGetData("/api/table");

	const complete = import.meta.env.VITE_COMPLETE_PRICE;
	const quick = import.meta.env.VITE_QUICK_PRICE;

	useEffect(() => {
		(async () => {
			await reFetch();
		})();
	}, []);

	if (loading) {
		return <div>Loading...</div>;
	}

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
									<Td isNumeric fontWeight={"bold"}>
										{total.toFixed(2)}
									</Td>
								</Tr>
							);
						})}
				</Tbody>
			</Table>
		</div>
	);
};

export default HistoryTable;
