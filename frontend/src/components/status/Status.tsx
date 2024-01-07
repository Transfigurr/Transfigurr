import styles from "./Status.module.scss";
import { useContext } from "react";
import { WebSocketContext } from "../../contexts/webSocketContext";
const Status = () => {
	const wsContext = useContext(WebSocketContext);
	const system: any = wsContext?.data?.system;

	return (
		<div className={styles.status}>
			<div className={styles.diskSpace}>
				<div className={styles.header}>Disk Space</div>
				<table className={styles.table}>
					<thead>
						<tr className={styles.headRow}>
							<th>Location</th>
							<th>Free Space</th>
							<th>Total Space</th>
							<th>Bar</th>
						</tr>
					</thead>
					<tbody>
						<tr className={styles.row}>
							<td>/config</td>
							<td>{(system?.config_free_space / 1000000000).toFixed(2)} GB</td>
							<td>{(system?.config_total_space / 1000000000).toFixed(2)} GB</td>
							<td>
								<div
									style={{
										height: "20px",
										width: "100%",
										backgroundColor: "#f3f3f3",
										boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.1)",
										borderRadius: "4px",
									}}
								>
									<div
										style={{
											height: "100%",
											width: `${(system?.config_free_space /
												system?.config_total_space) *
												100}%`,
											backgroundColor: "var(--transfigurrPurple)",
											borderRadius: "4px",
										}}
									/>
								</div>
							</td>
						</tr>
						<tr className={styles.row}>
							<td>/movies</td>
							<td>{(system?.movies_free_space / 1000000000).toFixed(2)} GB</td>
							<td>{(system?.movies_total_space / 1000000000).toFixed(2)} GB</td>
							<td>
								<div
									style={{
										height: "20px",
										width: "100%",
										backgroundColor: "#f3f3f3",
										boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.1)",
										borderRadius: "4px",
									}}
								>
									<div
										style={{
											height: "100%",
											width: `${(system?.movies_free_space /
												system?.movies_total_space) *
												100}%`,
											backgroundColor: "var(--transfigurrPurple)",
											borderRadius: "4px",
										}}
									/>
								</div>
							</td>
						</tr>
						<tr className={styles.row}>
							<td>/series</td>
							<td>{(system?.series_free_space / 1000000000).toFixed(2)} GB</td>
							<td>{(system?.series_total_space / 1000000000).toFixed(2)} GB</td>
							<td>
								<div
									style={{
										height: "20px",
										width: "100%",
										backgroundColor: "#f3f3f3",
										boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.1)",
										borderRadius: "4px",
									}}
								>
									<div
										style={{
											height: "100%",
											width: `${(system?.series_free_space /
												system?.series_total_space) *
												100}%`,
											backgroundColor: "var(--transfigurrPurple)",
											borderRadius: "4px",
										}}
									/>
								</div>
							</td>
						</tr>
						<tr className={styles.row}>
							<td>/transcode</td>
							<td>
								{(system?.transcode_free_space / 1000000000).toFixed(2)} GB
							</td>
							<td>
								{(system?.transcode_total_space / 1000000000).toFixed(2)} GB
							</td>
							<td>
								<div
									style={{
										height: "20px",
										width: "100%",
										backgroundColor: "#f3f3f3",
										boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.1)",
										borderRadius: "4px",
									}}
								>
									<div
										style={{
											height: "100%",
											width: `${(system?.transcode_free_space /
												system?.transcode_total_space) *
												100}%`,
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
	);
};
export default Status;
