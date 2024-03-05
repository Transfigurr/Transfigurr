import styles from "./Queue.module.scss";
import { useContext, useState } from "react";
import { WebSocketContext } from "../../contexts/webSocketContext";
import { ReactComponent as SkipNext } from "../svgs/skip_next.svg";
import { ReactComponent as SkipPrevious } from "../svgs/skip_previous.svg";
import { ReactComponent as NavigateNext } from "../svgs/navigate_next.svg";
import { ReactComponent as NavigateBefore } from "../svgs/navigate_before.svg";
import { ReactComponent as ResetWrench } from "../svgs/reset_wrench.svg";
import { ReactComponent as QueueIcon } from "../svgs/queue.svg";
import Codec from "../codec/Codec";
import QueueToolbar from "../toolbars/queueToolbar/QueueToolbar";
import QueueModal from "../modals/queueModal/QueueModal";

const Queue = () => {
	const wsContext = useContext(WebSocketContext);
	const profiles = wsContext?.data?.profiles;
	const series = wsContext?.data?.series;
	const queue = wsContext?.data?.queue;
	const settings = wsContext?.data?.settings;
	const recordsPerPage = settings?.queue_page_size || 0;
	const [currentPage, setCurrentPage] = useState(1);
	const queueArray = Array.from(Object.values(queue?.queue || []));
	const indexOfLastRecord = currentPage * recordsPerPage;
	const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
	const currentRecords = queueArray.slice(
		indexOfFirstRecord,
		indexOfLastRecord,
	);

	const totalPages = Math.ceil(queueArray.length / recordsPerPage);

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

	const [selected, setSelected] = useState<string | null>(null);

	const setSetting = async (key: string, value: any) => {
		await fetch(`http://${window.location.hostname}:7889/api/settings`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
			body: JSON.stringify({ id: key, value: value }),
		});
	};

	const onModalSave = async () => {
		for (const key in content) {
			fetch(`http://${window.location.hostname}:7889/api/settings`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
				body: JSON.stringify({ id: key, value: content[key] }),
			});
		}
		setIsModalOpen(false);
	};

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [content, setContent] = useState<any>({});

	const handleOptionsClick = () => {
		setContent(settings);
		setIsModalOpen(true);
	};

	return (
		<div className={styles.queue}>
			<QueueToolbar
				settings={settings}
				setSetting={setSetting}
				selected={selected}
				setSelected={setSelected}
				handleOptionsClick={handleOptionsClick}
			/>
			<QueueModal
				isOpen={isModalOpen}
				setIsOpen={setIsModalOpen}
				onSave={onModalSave}
				content={content}
				setContent={setContent}
			/>
			<div className={styles.content}>
				<>
					<div className={styles.currentContainer}>
						<div className={styles.current}>
							<table className={styles.table}>
								<thead>
									<tr className={styles.headRow}>
										<th></th>
										<th>Series</th>
										<th>Episode</th>
										<th>Profile</th>
										<th>Stage</th>
										<th>ETA</th>
										<th>Progress</th>
									</tr>
								</thead>
								<tbody>
									<tr className={styles.row}>
										<td>
											<ResetWrench
												style={{
													height: "25px",
													width: "25px",
												}}
											/>
										</td>
										<td className={styles.name}>
											<a
												href={"/series/" + queue?.current?.series_id}
												className={styles.name}
											>
												{queue?.current?.series_id}
											</a>
										</td>
										<td>
											{queue?.current ? (
												<>
													{queue?.current?.season_number}x
													{queue?.current?.episode_number}
												</>
											) : (
												<></>
											)}
										</td>
										<td>
											{profiles &&
											series &&
											series[queue?.current?.series_id] &&
											profiles[series[queue?.current?.series_id].profile_id]
												? profiles[series[queue?.current?.series_id].profile_id]
														.codec
												: ""}
										</td>
										<td>{queue?.stage}</td>
										<td>
											{queue?.current ? (
												<>
													{Math.floor(
														parseInt(queue?.eta || 0) / 60,
													).toString() +
														":" +
														(parseInt(queue?.eta || 0) % 60).toString()}
												</>
											) : (
												<></>
											)}
										</td>
										<td>
											<div
												style={{
													height: "20px",
													width: "100%",
													backgroundColor: "var(--progressBarBackgroundColor)",
													boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.1)",
													borderRadius: "4px",
												}}
											>
												<div
													style={{
														height: "100%",
														width: `${queue?.progress || 0}%`,
														backgroundColor: "var(--transfigurrPurple)",
														borderRadius: "4px",
													}}
												/>
											</div>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
					{currentRecords?.length !== 0 ? (
						<>
							<table className={styles.table}>
								<thead>
									<tr className={styles.headRow}>
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
										<tr className={styles.row}>
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
												<a
													href={"/series/" + q?.series_id}
													className={styles.name}
												>
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
											<td>
												{(q?.size / 1000000000).toFixed(2).toString() + " GB"}
											</td>
										</tr>
									))}
								</tbody>
							</table>
							<div className={styles.navigation}>
								<div
									onClick={firstPage}
									className={
										currentPage === 1 ? styles.disabled : styles.button
									}
								>
									<SkipPrevious />
								</div>
								<div
									onClick={prevPage}
									className={
										currentPage === 1 ? styles.disabled : styles.button
									}
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
								Total Records: {queueArray.length}
							</div>
						</>
					) : (
						<></>
					)}
				</>
			</div>
		</div>
	);
};
export default Queue;
