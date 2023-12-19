import useSystem from "../../hooks/useSystem";
import styles from "./Status.module.scss";
const Status = () => {
	const system: any = useSystem();

	return (
		<div className={styles.status}>
			<div className={styles.diskSpace}>
				<div className={styles.header}>Disk Space</div>
				<table>
					<thead>
						<tr>
							<th>Location</th>
							<th>Free Space</th>
							<th>Total Space</th>
							<th>Bar</th>
						</tr>
					</thead>
					<tbody>
						<tr>
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
											backgroundColor: "#5d9cec",
											borderRadius: "4px",
										}}
									/>
								</div>
							</td>
						</tr>
						<tr>
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
											backgroundColor: "#5d9cec",
											borderRadius: "4px",
										}}
									/>
								</div>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			<div className={styles.about}>
				<div className={styles.header}>About</div>
			</div>
			<div className={styles.moreInfo}>
				<div className={styles.header}>More Info</div>
			</div>
		</div>
	);
};
export default Status;
