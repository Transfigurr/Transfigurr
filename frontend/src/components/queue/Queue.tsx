import styles from "./Queue.module.scss";
import { useContext, useState } from "react";
import { WebSocketContext } from "../../contexts/webSocketContext";
import { ReactComponent as ResetWrench } from "../svgs/reset_wrench.svg";
import QueueToolbar from "../toolbars/queueToolbar/QueueToolbar";
import QueueModal from "../modals/queueModal/QueueModal";
import { formatETA } from "../../utils/format";
import QueueTable from "../tables/queueTable/QueueTable";

const Queue = () => {
	const wsContext = useContext(WebSocketContext);
	const profiles = wsContext?.data?.profiles;
	const series = wsContext?.data?.series;
	const queue = wsContext?.data?.queue;
	const settings = wsContext?.data?.settings;
	const [selected, setSelected] = useState<string | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [content, setContent] = useState<any>({});
	const queueArray = Array.from(Object.values(queue?.queue || []));

	return (
		<div className={styles.queue}>
			<QueueToolbar
				settings={settings}
				setContent={setContent}
				setIsModalOpen={setIsModalOpen}
				selected={selected}
				setSelected={setSelected}
			/>
			<QueueModal
				isOpen={isModalOpen}
				setIsOpen={setIsModalOpen}
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
										<td>
											{settings?.queue_status == "active"
												? queue?.stage || "--"
												: "paused"}
										</td>
										<td>{queue?.current && formatETA(queue?.eta)}</td>
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
					{queueArray?.length !== 0 ? (
						<>
							<QueueTable
								series={series}
								profiles={profiles}
								queueArray={queueArray}
								settings={settings}
							/>
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
