import ToolBar from "../ToolBar/ToolBar";
import ToolBarItem from "../ToolBarItem/ToolBarItem";
import styles from "./MassEditor.module.scss";

import VisibilityIcon from "@mui/icons-material/Visibility";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import AppsIcon from "@mui/icons-material/Apps";
import RssFeedIcon from "@mui/icons-material/RssFeed";
import SyncIcon from "@mui/icons-material/Sync";
import SwitchLeftIcon from "@mui/icons-material/SwitchLeft";
import { useEffect, useState } from "react";
import useProfiles from "../../hooks/useProfiles";
import useProfilesAPI from "../../hooks/useProfilesAPI";
import useSeriesAPI from "../../hooks/useSeriesAPI";

const MassEditor = () => {
	const leftToolBarItems: any = [
		<ToolBarItem text="Update" icon={<SyncIcon fontSize="large" />} />,
		<ToolBarItem text="RSS Sync" icon={<RssFeedIcon fontSize="medium" />} />,
	];

	const middleToolBarItems: any = [
		<ToolBarItem text="Options" icon={<AppsIcon fontSize="large" />} />,
	];
	const rightToolBarItems: any = [
		<ToolBarItem text="View" icon={<VisibilityIcon fontSize="medium" />} />,
		<ToolBarItem text="Sort" icon={<SwitchLeftIcon fontSize="medium" />} />,
		<ToolBarItem text="Filter" icon={<FilterAltIcon fontSize="medium" />} />,
	];
	const series: any = useSeriesAPI();
	const profiles: any = useProfilesAPI();
	const [selectedSeries, setSelectedSeries] = useState<any>([]);

	const [monitored, setMonitored] = useState<any>(false);

	const [profile, setProfile] = useState<any>();
	console.log(profiles);
	console.log(monitored, profile, selectedSeries);
	const applyChanges = () => {
		for (const s in selectedSeries) {
			selectedSeries[s].monitored =
				parseInt(monitored) !== -1 ? parseInt(monitored) : undefined;
			selectedSeries[s].profile_id =
				parseInt(profile) !== 0 ? parseInt(profile) : undefined;
			console.log("test", selectedSeries[s]);
			fetch(`http://localhost:8000/api/series/${selectedSeries[s].id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(selectedSeries[s]),
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
			<table>
				<thead>
					<tr>
						<th></th>
						<th>Series Title</th>
						<th>Codec Profile</th>
						<th>Path</th>
						<th>Size on Disk</th>
					</tr>
				</thead>
				<tbody>
					{series?.map((s: any, index: any) => (
						<tr>
							<td>
								<input
									type="checkbox"
									checked={selectedSeries.includes(s)}
									onChange={() => handleCheckboxChange(s)}
								/>
							</td>
							<td>{s.name}</td>
							<td>{profiles[s.profile_id]?.name}</td>
							<td>/series/{s.id}</td>
							<td>{(s.size / 1000000000).toFixed(2)} GB</td>
						</tr>
					))}
				</tbody>
			</table>
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
						{Object.values(profiles)?.map((profile: any) => (
							<option value={profile.id}>{profile.name}</option>
						))}
					</select>
				</div>
				<button className={styles.apply} onClick={applyChanges}>
					Apply
				</button>
			</div>
		</div>
	);
};
export default MassEditor;
