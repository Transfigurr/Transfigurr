import styles from "./HistoryTable.module.scss";
import ResetWrench from "../../svgs/reset_wrench.svg?react";
import Codec from "../../codec/Codec";
import { formatDate, formatSize } from "../../../utils/format";
import Table from "../../table/Table";
import { useState } from "react";

const HistoryTable = ({ historyArray, settings }: any) => {
	const recordsPerPage = settings?.history_page_size || 0;
	const [currentPage, setCurrentPage] = useState(1);
	const indexOfLastRecord = currentPage * recordsPerPage;
	const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
	const currentRecords = historyArray.slice(
		indexOfFirstRecord,
		indexOfLastRecord
	);
	const totalPages = Math.ceil(historyArray.length / recordsPerPage);
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
					<th>Series</th>
					<th>Episode</th>
					<th>Episode Title</th>
					<th>Codec</th>
					<th>Original Codec</th>
					<th>Space Saved</th>
					<th>Date</th>
				</tr>
			</thead>
			<tbody>
				{currentRecords.reverse().map((entry: any, index: number) => (
					<tr className={styles.row} key={index}>
						<td>
							<ResetWrench className={styles.svg} />
						</td>
						<td>
							<a
								href={"/series/" + entry?.episode?.series_id}
								className={styles.name}
							>
								{entry?.episode?.series_id}
							</a>
						</td>
						<td>
							{entry?.episode?.season_number}x{entry?.episode?.episode_number}
						</td>
						<td>{entry?.episode?.episode_name}</td>
						<td className={styles.codecRow}>
							<Codec codec={entry?.prev_codec} />
						</td>
						<td className={styles.codecRow}>
							<Codec codec={entry?.new_codec} />
						</td>
						<td>{formatSize(entry?.episode?.space_saved)}</td>
						<td>{formatDate(entry?.date)}</td>
					</tr>
				))}
			</tbody>
		</Table>
	);
};
export default HistoryTable;
