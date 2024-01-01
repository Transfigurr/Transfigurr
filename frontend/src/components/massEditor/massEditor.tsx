import styles from "./MassEditor.module.scss";
import { useContext, useState } from "react";
import { WebSocketContext } from "../../contexts/webSocketContext";

const MassEditor = () => {
	const wsContext: any = useContext(WebSocketContext);
	const series: any = wsContext?.data?.series;
	const profiles: any = wsContext?.data?.profiles;
	const [selectedSeries, setSelectedSeries] = useState<any>([]);
	const [monitored, setMonitored] = useState<any>(false);
	const [profile, setProfile] = useState<any>();
	const applyChanges = () => {
		for (const series of selectedSeries) {
			series.monitored =
				parseInt(monitored) !== -1 ? parseInt(monitored) : undefined;
			series.profile_id =
				parseInt(profile) !== 0 ? parseInt(profile) : undefined;
			fetch(`http://localhost:8000/api/series/${series.id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(series),
			});
		}
	};

	const handleCheckboxChange = (series: any) => {
		setSelectedSeries((prevSelected: any[]) =>
			prevSelected.includes(series)
				? prevSelected.filter((s) => s !== series)
				: [...prevSelected, series]
		);
	};
	return (
		<div className={styles.massEditor}>
			<div className={styles.content}>
				{series && series.length !== 0 ? (
					<>
						<table>
							<thead>
								<tr>
									<th></th>
									<th>Series Title</th>
									<th>Monitored</th>
									<th>Codec Profile</th>
									<th>Path</th>
									<th>Size on Disk</th>
								</tr>
							</thead>
							<tbody>
								{Object.values(series || {}).map((s: any, index: any) => (
									<tr>
										<td>
											<input
												type="checkbox"
												checked={selectedSeries.some(
													(series: any) => series.id === s.id
												)}
												onChange={() => handleCheckboxChange(s)}
											/>
										</td>
										<td>{s.name}</td>
										<td>
											{s.monitored ? Boolean(s.monitored).toString() : "false"}
										</td>
										<td>{profiles[s.profile_id]?.name}</td>
										<td>/series/{s.id}</td>
										<td>{(s.size / 1000000000).toFixed(2)} GB</td>
									</tr>
								))}
							</tbody>
						</table>
					</>
				) : (
					<>No Media Found</>
				)}
			</div>
			<div className={styles.footer}>
				<div className={styles.input}>
					<div className={styles.inputContainer}>
						<label>Monitored </label>
						<select
							className={styles.select}
							value={monitored}
							onChange={(e) => {
								setMonitored(e.target.value);
							}}
						>
							<option value={-1}>{"No Change"}</option>
							<option value={0}>{"Not Monitored"}</option>
							<option value={1}>{"Monitored"}</option>
						</select>
					</div>
					<div className={styles.inputContainer}>
						<label>Profile </label>
						<select
							className={styles.select}
							value={profile}
							onChange={(e) => {
								setProfile(e.target.value);
							}}
						>
							<option value={0}>{"No Change"}</option>
							{Object.values(profiles || {}).map((profile: any) => (
								<option value={profile.id}>{profile.name}</option>
							))}
						</select>
					</div>
					<button className={styles.apply} onClick={applyChanges}>
						Apply
					</button>
				</div>
			</div>
		</div>
	);
};
export default MassEditor;
