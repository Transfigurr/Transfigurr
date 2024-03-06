import styles from "./History.module.scss";
import { WebSocketContext } from "../../contexts/webSocketContext";
import { useContext, useState } from "react";
import { ReactComponent as SkipNext } from "../svgs/skip_next.svg";
import { ReactComponent as SkipPrevious } from "../svgs/skip_previous.svg";
import { ReactComponent as NavigateNext } from "../svgs/navigate_next.svg";
import { ReactComponent as NavigateBefore } from "../svgs/navigate_before.svg";
import { ReactComponent as ResetWrench } from "../svgs/reset_wrench.svg";
import Codec from "../codec/Codec";
import HistoryToolbar from "../toolbars/historyToolbar/HistoryToolbar";
import HistoryModal from "../modals/historyModal/HistoryModal";
import { formatDate, formatSize } from "../../utils/format";

const History = () => {
	const wsContext: any = useContext(WebSocketContext);
	const settings: any = wsContext?.data?.settings;
	const history = wsContext?.data?.history;
	const recordsPerPage = settings?.history_page_size || 0;
	const [currentPage, setCurrentPage] = useState(1);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [content, setContent] = useState({});
	const [selected, setSelected] = useState(null);
	const historyArray = Array.from(Object.values(history || {}));
	const indexOfLastRecord = currentPage * recordsPerPage;
	const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
	const currentRecords = historyArray.slice(
		indexOfFirstRecord,
		indexOfLastRecord,
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
		<div className={styles.history}>
			<HistoryToolbar
				settings={settings}
				setContent={setContent}
				setIsModalOpen={setIsModalOpen}
				selected={selected}
				setSelected={setSelected}
			/>
			<HistoryModal
				isOpen={isModalOpen}
				setIsOpen={setIsModalOpen}
				content={content}
				setContent={setContent}
			/>
			<div className={styles.content}>
				{currentRecords && currentRecords.length !== 0 ? (
					<>
						<table className={styles.table}>
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
											<ResetWrench />
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
											{entry?.episode?.season_number}x
											{entry?.episode?.episode_number}
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
						</table>
						<div className={styles.navigation}>
							<div
								onClick={firstPage}
								className={currentPage === 1 ? styles.disabled : styles.button}
							>
								<SkipPrevious />
							</div>
							<div
								onClick={prevPage}
								className={currentPage === 1 ? styles.disabled : styles.button}
							>
								<NavigateBefore />
							</div>
							<div className={styles.pageInfo}>
								{currentPage} / {totalPages}
							</div>
							<div
								onClick={nextPage}
								className={
									currentPage === totalPages ? styles.disabled : styles.button
								}
							>
								<NavigateNext />
							</div>
							<div
								onClick={lastPage}
								className={
									currentPage === totalPages ? styles.disabled : styles.button
								}
							>
								<SkipNext />
							</div>
						</div>
						<div className={styles.totalRecords}>
							Total Records: {historyArray.length}
						</div>
					</>
				) : (
					<>History is empty</>
				)}
			</div>
		</div>
	);
};
export default History;
