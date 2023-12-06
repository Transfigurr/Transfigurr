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

	const [series, setSeries] = useState([]);

	const { profiles, setShouldSubscribe }: any = useProfiles();

	useEffect(() => {
		fetch("http://localhost:8000/api/data/series")
			.then((response) => response.json())
			.then((data) => setSeries(data))
			.catch((error) => console.error(error));
	}, []);
	return (
		<div className={styles.massEditor}>
			<ToolBar
				leftToolBarItems={leftToolBarItems}
				middleToolBarItems={middleToolBarItems}
				rightToolBarItems={rightToolBarItems}
			/>
			<table>
				<thead>
					<tr>
						<th>Series Title</th>
						<th>Codec Profile</th>
						<th>Path</th>
						<th>Size on Disk</th>
					</tr>
				</thead>
				<tbody>
					{series?.map((s: any, index: any) => (
						<tr>
							<td>{s.name}</td>
							<td>
								{profiles && s.profile in profiles
									? profiles[s.profile]["name"]
									: ""}
							</td>
							<td>{s.series_path}</td>
							<td>{s.size}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};
export default MassEditor;
