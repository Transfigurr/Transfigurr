import styles from "./Events.module.scss";
import { WebSocketContext } from "../../contexts/webSocketContext";
import { useContext, useState } from "react";
import { ReactComponent as SkipNext } from "../svgs/skip_next.svg";
import { ReactComponent as SkipPrevious } from "../svgs/skip_previous.svg";
import { ReactComponent as NavigateNext } from "../svgs/navigate_next.svg";
import { ReactComponent as NavigateBefore } from "../svgs/navigate_before.svg";
import { ReactComponent as Info } from "../svgs/info.svg";
import { ReactComponent as Warning } from "../svgs/warning.svg";
import { ReactComponent as Error } from "../svgs/error.svg";
import EventsModal from "../modals/eventsModal/EventsModal";
import EventsToolbar from "../toolbars/eventsToolbar/EventsToolbar";
import { formatDate } from "../../utils/format";

const Events = () => {
	const wsContext: any = useContext(WebSocketContext);
	const settings = wsContext?.data?.settings;
	const logs = wsContext?.data?.logs || [];
	let sortedLogs = [...logs].sort((a, b) => b.id - a.id);
	if (settings?.events_filter == "info") {
		sortedLogs = sortedLogs.filter((log: any) => {
			return log.level == "INFO";
		});
	} else if (settings?.events_filter == "warn") {
		sortedLogs = sortedLogs.filter((log: any) => {
			return log.level == "WARN";
		});
	} else if (settings?.events_filter == "error") {
		sortedLogs = sortedLogs.filter((log: any) => {
			return log.level == "Error";
		});
	}
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [content, setContent] = useState<any>({});
	const [selected, setSelected] = useState<string | null>(null);
	const recordsPerPage = settings?.events_page_size || 0;
	const [currentPage, setCurrentPage] = useState(1);
	const indexOfLastRecord = currentPage * recordsPerPage;
	const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
	const currentRecords = sortedLogs.slice(
		indexOfFirstRecord,
		indexOfLastRecord,
	);
	const totalPages = Math.ceil(logs.length / recordsPerPage);
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
		<div className={styles.logs}>
			<EventsToolbar
				selected={selected}
				setContent={setContent}
				setIsModalOpen={setIsModalOpen}
				setSelected={setSelected}
				settings={settings}
			/>
			<EventsModal
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
									<th>Timestamp</th>
									<th>Service</th>
									<th>Message</th>
								</tr>
							</thead>
							<tbody>
								{currentRecords.map((entry: any, index: number) => (
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
										<td className={styles.timestamp}>
											{formatDate(entry?.timestamp)}
										</td>
										<td style={{ width: "50px" }}>{entry?.service}</td>
										<td>{entry?.message}</td>
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
							Total Records: {logs.length}
						</div>
					</>
				) : (
					<>Events are empty</>
				)}
			</div>
		</div>
	);
};
export default Events;
