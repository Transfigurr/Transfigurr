import styles from "./History.module.scss";
import ToolBarItem from "../ToolBarItem/ToolBarItem";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import AppsIcon from "@mui/icons-material/Apps";
import RssFeedIcon from "@mui/icons-material/RssFeed";
import SyncIcon from "@mui/icons-material/Sync";
import SwitchLeftIcon from "@mui/icons-material/SwitchLeft";
import ToolBar from "../ToolBar/ToolBar";
import { WebSocketContext } from "../../contexts/webSocketContext";
import { useContext } from "react";

const History = () => {
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

	const wsContext: any = useContext(WebSocketContext);
	const history = wsContext?.data?.history;

	return (
		<div className={styles.history}>
			<ToolBar
				leftToolBarItems={[]}
				middleToolBarItems={[]}
				rightToolBarItems={[]}
			/>
			<div className={styles.content}>
				{history && history.length === 0 ? (
					<table>
						<thead>
							<tr>
								<th>Series</th>
								<th>Season</th>
								<th>Episode</th>
								<th>Episode Title</th>
								<th>Current Codec</th>
								<th>Future Codec</th>
								<th>Profile</th>
							</tr>
						</thead>
						<tbody>
							{Object.values(history || {})
								.reverse()
								.map((entry: any) => (
									<tr>
										<td>{entry?.episode?.series_id}</td>
										<td>{entry?.episode?.season_name}</td>
										<td>{entry?.episode?.episode_number}</td>
										<td>{entry?.episode?.episode_name}</td>
										<td>{entry?.prev_codec}</td>
										<td>{entry?.new_codec}</td>
										<td>{entry?.profile?.name}</td>
									</tr>
								))}
						</tbody>
					</table>
				) : (
					<>History is Empty</>
				)}
			</div>
		</div>
	);
};
export default History;
