import styles from "./QueueTable.module.scss";
import { ReactComponent as QueueIcon } from "../../svgs/queue.svg";
import Codec from "../../codec/Codec";
import { formatSize } from "../../../utils/format";
import Table from "../../table/Table";
import { useState } from "react";
const QueueTable = ({ queueArray, profiles, series, settings }: any) => {
	const [currentPage, setCurrentPage] = useState(1);
	const recordsPerPage = settings?.queue_page_size || 0;
	const totalPages = Math.ceil(queueArray.length / recordsPerPage);
	const indexOfLastRecord = currentPage * recordsPerPage;
	const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
	const currentRecords = queueArray.slice(
		indexOfFirstRecord,
		indexOfLastRecord,
	);
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
				<tr>
					<th></th>
					<th>Series</th>
					<th>Episode</th>
					<th>Episode Title</th>
					<th>Profile</th>
					<th>Codec</th>
					<th>Future Codec</th>
					<th>Size</th>
				</tr>
			</thead>
			<tbody>
				{currentRecords?.map((q: any, index: number) => (
					<tr>
						<td>
							<QueueIcon
								style={{
									height: "25px",
									width: "25px",
									fill: "var(--textColor)",
								}}
							/>
						</td>
						<td>
							<a href={"/series/" + q?.series_id} className={styles.name}>
								{q?.series_id}
							</a>
						</td>
						<td>
							{q.season_number}x{q.episode_number}
						</td>
						<td>{q.episode_name}</td>
						<td>
							{profiles &&
							series &&
							series[q?.series_id] &&
							profiles[series[q?.series_id].profile_id]
								? profiles[series[q?.series_id].profile_id].name
								: ""}
						</td>
						<td className={styles.codecRow}>
							<Codec codec={q.video_codec} />
						</td>
						<td className={styles.codecRow}>
							<Codec
								codec={
									profiles &&
									series &&
									series[q?.series_id] &&
									profiles[series[q?.series_id].profile_id]
										? profiles[series[q?.series_id].profile_id].codec
										: ""
								}
							/>
						</td>
						<td>{formatSize(q?.size)}</td>
					</tr>
				))}
			</tbody>
		</Table>
	);
};
export default QueueTable;
