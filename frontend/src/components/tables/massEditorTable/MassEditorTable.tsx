import InputCheckbox from "../../inputs/inputCheckbox/InputCheckbox";
import Table from "../../table/Table";
import styles from "./MassEditorTable.module.scss";
import { formatSize } from "../../../utils/format";
import BookmarkFilled from "../../svgs/bookmark_filled.svg?react";
import BookmarkUnfilled from "../../svgs/bookmark_unfilled.svg?react";
import ContinuingIcon from "../../svgs/play_arrow.svg?react";
import StoppedIcon from "../../svgs/stop.svg?react";
import { Tooltip } from "react-tooltip";
const MassEditorTable = ({
	sortedSeries,
	selectedSeries,
	selectAll,
	handleSelectAllChange,
	handleCheckboxChange,
	profiles,
}: any) => {
	return (
		<Table>
			<thead>
				<tr className={styles.headRow}>
					<th>
						<InputCheckbox
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
				{sortedSeries?.map((s: any, index: any) => (
					<tr className={styles.row} key={index}>
						<td className={styles.inputCell}>
							<InputCheckbox
								checked={selectedSeries.some(
									(series: any) => series.id === s.id
								)}
								onChange={() => handleCheckboxChange(s)}
							/>
						</td>
						<td className={styles.iconCell}>
							{s?.monitored ? (
								<BookmarkFilled
									data-tooltip-id="monitoredTooltip"
									className={styles.svg}
								/>
							) : (
								<BookmarkUnfilled
									data-tooltip-id="unmonitoredTooltip"
									className={styles.svg}
								/>
							)}
							{s?.status !== "Ended" ? (
								<ContinuingIcon
									data-tooltip-id="continuingTooltip"
									className={styles.svg}
								/>
							) : (
								<StoppedIcon
									data-tooltip-id="stoppedTooltip"
									className={styles.svg}
								/>
							)}
							<Tooltip id="monitoredTooltip" place="top" content="Monitored" />
							<Tooltip
								id="unmonitoredTooltip"
								place="top"
								content="Unmonitored"
							/>
							<Tooltip
								id="continuingTooltip"
								place="top"
								content="Continuing"
							/>
							<Tooltip id="stoppedTooltip" place="top" content="Stopped" />
						</td>
						<td>
							<a href={"/series/" + s?.id} className={styles.name}>
								{s?.id}
							</a>
						</td>
						<td>{profiles ? profiles[s.profile_id]?.name : ""}</td>
						<td>/series/{s.id}</td>
						<td>{formatSize(s.space_saved)}</td>
						<td>{formatSize(s.size)}</td>
					</tr>
				))}
			</tbody>
		</Table>
	);
};
export default MassEditorTable;
