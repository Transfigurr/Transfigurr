import styles from "./MassEditor.module.scss";
import { useContext, useState } from "react";
import { WebSocketContext } from "../../contexts/webSocketContext";
import { ReactComponent as BookmarkFilled } from "../svgs/bookmark_filled.svg";
import { ReactComponent as BookmarkUnfilled } from "../svgs/bookmark_unfilled.svg";
import { ReactComponent as ContinuingIcon } from "../svgs/play_arrow.svg";
import { ReactComponent as StoppedIcon } from "../svgs/stop.svg";
import ToolBar from "../ToolBar/ToolBar";

const MassEditor = () => {
	const wsContext: any = useContext(WebSocketContext);
	const series: any = wsContext?.data?.series;
	const seriesArray = Array.from(Object.values(series || {}));
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
			fetch(`http://${window.location.hostname}:8000/api/series/${series.id}`, {
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
			prevSelected.some((s) => s.id === series.id)
				? prevSelected.filter((s) => s.id !== series.id)
				: [...prevSelected, series],
		);
	};
	const [selectAll, setSelectAll] = useState(false);
	const handleSelectAllChange = () => {
		setSelectAll(!selectAll);
		setSelectedSeries(!selectAll ? seriesArray : []);
	};
	return (
		<div className={styles.massEditor}>
			<ToolBar />
			<div className={styles.content}>
				{series && series.length !== 0 ? (
					<>
						<table className={styles.table}>
							<thead>
								<tr className={styles.headRow}>
									<th>
										<input
											className={styles.checkbox}
											type="checkbox"
											checked={selectAll}
											onChange={handleSelectAllChange}
										/>
									</th>
									<th></th>
									<th>Series</th>
									<th>Profile</th>
									<th>Path</th>
									<th>Space Saved</th>
									<th>Size on Disk</th>
								</tr>
							</thead>
							<tbody>
								{seriesArray?.map((s: any, index: any) => (
									<tr className={styles.row}>
										<td className={styles.inputCell}>
											<input
												className={styles.checkbox}
												type="checkbox"
												checked={selectedSeries.some(
													(series: any) => series.id === s.id,
												)}
												onChange={() => handleCheckboxChange(s)}
											/>
										</td>
										<td className={styles.iconCell}>
											{s?.monitored ? (
												<BookmarkFilled className={styles.monitored} />
											) : (
												<BookmarkUnfilled className={styles.monitored} />
											)}
											{s?.status !== "Ended" ? (
												<ContinuingIcon className={styles.continue} />
											) : (
												<StoppedIcon className={styles.stopped} />
											)}
										</td>
										<td>
											<a href={"/series/" + s?.id} className={styles.name}>
												{s?.id}
											</a>
										</td>
										<td>{profiles ? profiles[s.profile_id]?.name : ""}</td>
										<td>/series/{s.id}</td>
										<td>{(s.space_saved / 1000000000).toFixed(2)} GB</td>
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
					<div className={styles.buttonContainer}>
						<button className={styles.apply} onClick={applyChanges}>
							Apply
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};
export default MassEditor;
