import styles from "./QueueTable.module.scss";
import QueueIcon from "../../svgs/queue.svg?react";
import Codec from "../../codec/Codec";
import { formatSize } from "../../../utils/format";
import Table from "../../table/Table";
import { useEffect, useState } from "react";
const QueueTable = ({ queueArray, profiles, series, settings }: any) => {
	const [currentPage, setCurrentPage] = useState(1);
	const recordsPerPage = settings?.queue_page_size || 0;
	const totalPages = Math.ceil(queueArray.length / recordsPerPage);
	const indexOfLastRecord = currentPage * recordsPerPage;
	const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
	const currentRecords = queueArray.slice(
		indexOfFirstRecord,
		indexOfLastRecord
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
	useEffect(() => {
		setCurrentPage(1);
	}, [recordsPerPage]);

	return (
		<Table
			showPagination={true}
			firstPage={firstPage}
			currentPage={currentPage}
			prevPage={prevPage}
			totalPages={totalPages}
			totalRecords={queueArray.length}
			lastPage={lastPage}
			nextPage={nextPage}
		>
			<thead>
				<tr>
					<th></th>
					<th>Title</th>
					<th>Type</th>
					<th>Episode</th>
					<th>Profile</th>
					<th>Codec</th>
					<th>Future Codec</th>
					<th>Size</th>
				</tr>
			</thead>
			<tbody>
				{currentRecords?.map((q: any) => (
					<tr>
						<td>
							<QueueIcon className={styles.svg} />
						</td>
						<td>
							<a
								href={
									q?.series_id ? "/series/" + q?.series_id : "/movies/" + q?.id
								}
								className={styles.name}
							>
								{q?.series_id ? q?.series_id : q?.id}
							</a>
						</td>
						<td>{q?.series_id ? "Series" : "Movie"}</td>
						<td>
							{q?.series_id && (
								<>
									{q.season_number}x{q.episode_number}
								</>
							)}
						</td>
						<td>
							{q?.series_id ? (
								<>
									{profiles &&
									series &&
									series[q?.series_id] &&
									profiles[series[q?.series_id].profile_id]
										? profiles[series[q?.series_id].profile_id].name
										: ""}
								</>
							) : (
								<>
									{profiles && profiles[q?.profile_id]
										? profiles[q?.profile_id].name
										: ""}
								</>
							)}
						</td>
						<td className={styles.codecRow}>
							<Codec codec={q.video_codec} />
						</td>
						<td className={styles.codecRow}>
							<Codec
								codec={
									q?.series_id ? (
										<>
											{profiles &&
											series &&
											series[q?.series_id] &&
											profiles[series[q?.series_id].profile_id]
												? profiles[series[q?.series_id].profile_id].codec
												: ""}
										</>
									) : (
										<>
											{profiles && profiles[q?.profile_id]
												? profiles[q?.profile_id].codec
												: ""}
										</>
									)
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
