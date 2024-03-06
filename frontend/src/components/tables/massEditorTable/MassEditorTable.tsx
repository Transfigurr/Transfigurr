import InputCheckbox from "../../inputs/inputCheckbox/InputCheckbox";
import Table from "../../table/Table";
import styles from "./MassEditorTable.module.scss";
import { formatSize } from "../../../utils/format";
import { ReactComponent as BookmarkFilled } from "../../svgs/bookmark_filled.svg";
import { ReactComponent as BookmarkUnfilled } from "../../svgs/bookmark_unfilled.svg";
import { ReactComponent as ContinuingIcon } from "../../svgs/play_arrow.svg";
import { ReactComponent as StoppedIcon } from "../../svgs/stop.svg";
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
						<td>{formatSize(s.space_saved)}</td>
						<td>{formatSize(s.size)}</td>
					</tr>
				))}
			</tbody>
		</Table>
	);
};
export default MassEditorTable;
