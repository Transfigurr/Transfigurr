import styles from "./EventsTable.module.scss";
import Info from "../../svgs/info.svg?react";
import Warning from "../../svgs/warning.svg?react";
import Error from "../../svgs/error.svg?react";
import { formatDate } from "../../../utils/format";
import Table from "../../table/Table";
import { useState } from "react";

const EventsTable = ({ sortedLogs, settings }: any) => {
	const recordsPerPage = settings?.events_page_size || 0;
	const [currentPage, setCurrentPage] = useState(1);
	const indexOfLastRecord = currentPage * recordsPerPage;
	const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
	const currentRecords = sortedLogs.slice(
		indexOfFirstRecord,
		indexOfLastRecord
	);
	const totalPages = Math.ceil(sortedLogs.length / recordsPerPage);
	const firstPage = () => {
		setCurrentPage(1);
	};
	const lastPage = () => {
		setCurrentPage(totalPages);
	};
	const nextPage = () => {
		if (currentPage < totalPages) {
			setCurrentPage(currentPage + 1);
		}
	};
	const prevPage = () => {
		if (currentPage > 1) {
			setCurrentPage(currentPage - 1);
		}
	};

	return (
		<Table
			showPagination={true}
			firstPage={firstPage}
			currentPage={currentPage}
			prevPage={prevPage}
			totalPages={totalPages}
			lastPage={lastPage}
			nextPage={nextPage}
		>
			<thead>
				<tr className={styles.headRow}>
					<th></th>
					<th>Time</th>
					<th>Service</th>
					<th>Message</th>
				</tr>
			</thead>
			<tbody>
				{currentRecords?.map((entry: any, index: number) => (
					<tr className={styles.row} key={index}>
						<td className={styles.iconCell}>
							{entry?.level === "INFO" ? (
								<Info
									style={{
										height: "100%",
										width: "100%",
										fill: "var(--transfigurrPurple)	",
									}}
								/>
							) : entry?.level === "WARNING" ? (
								<Warning
									style={{
										height: "100%",
										width: "100%",
										fill: "rgb(255, 165, 0)",
									}}
								/>
							) : entry?.level === "ERROR" ? (
								<Error
									style={{
										height: "100%",
										width: "100%",
										fill: "rgb(240, 80, 80)",
									}}
								/>
							) : null}
						</td>
						<td className={styles.timestamp}>{formatDate(entry?.timestamp)}</td>
						<td style={{ width: "50px" }}>{entry?.service}</td>
						<td>{entry?.message}</td>
					</tr>
				))}
			</tbody>
		</Table>
	);
};
export default EventsTable;
