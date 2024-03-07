import styles from "./MediaTable.module.scss";
import BookmarkFilled from "../../svgs/bookmark_filled.svg?react";
import BookmarkUnfilled from "../../svgs/bookmark_unfilled.svg?react";
import ContinuingIcon from "../../svgs/play_arrow.svg?react";
import StoppedIcon from "../../svgs/stop.svg?react";
import { Link } from "react-router-dom";
import { formatSize } from "../../../utils/format";
import Table from "../../table/Table";
const MediaTable = ({ settings, profiles, sortedSeries }: any) => {
	const progress = (series: any) => {
		return (
			((series?.episode_count - series?.missing_episodes) /
				series?.episode_count || 0) *
				100 +
			"%"
		);
	};

	const backgroundColor = (series: any) => {
		if (progress(series) === "100%") {
			return series?.status === "Ended"
				? "rgb(39, 194, 76)"
				: "rgb(93, 156, 236)";
		} else {
			return series?.monitored ? "rgb(240, 80, 80)" : "rgb(255, 165, 0)";
		}
	};
	return (
		<div className={styles.tableContainer}>
			<Table>
				<thead>
					<tr>
						<th></th>
						<th>Series</th>
						{settings?.media_table_showNetwork == "1" && <th>Network</th>}
						{settings?.media_table_showProfile == "1" && <th>Profile</th>}
						{settings?.media_table_showSeasons == "1" && <th>Seasons</th>}
						{settings?.media_table_showEpisodes == "1" && <th>Episodes</th>}
						{settings?.media_table_showEpisodeCount == "1" && (
							<th>Episode Count</th>
						)}
						{settings?.media_table_showYear == "1" && <th>Year</th>}
						{settings?.media_table_showPath == "1" && <th>Path</th>}
						{settings?.media_table_showSizeOnDisk == "1" && (
							<th>Size On Disk</th>
						)}
						{settings?.media_table_showSizeSaved == "1" && <th>Space Saved</th>}
						{settings?.media_table_showGenre == "1" && <th>Genre</th>}
					</tr>
				</thead>
				<tbody>
					{sortedSeries.map((series: any, key: number) => (
						<tr className={styles.row} key={key}>
							<td className={styles.iconCell}>
								{series?.monitored ? (
									<BookmarkFilled className={styles.svg} />
								) : (
									<BookmarkUnfilled className={styles.svg} />
								)}
								{series?.status !== "Ended" ? (
									<ContinuingIcon className={styles.svg} />
								) : (
									<StoppedIcon className={styles.svg} />
								)}
							</td>
							<td>
								<Link to={"/series/" + series?.id} className={styles.name}>
									{series?.id}
								</Link>
							</td>
							{settings?.media_table_showProfile == "1" && (
								<td>{profiles ? profiles[series.profile_id]?.name : ""}</td>
							)}
							{settings?.media_table_showNetwork == "1" && (
								<td>{series?.networks}</td>
							)}
							{settings?.media_table_showSeasons == "1" && (
								<td>{series?.seasons_count}</td>
							)}
							{settings?.media_table_showEpisodes == "1" && (
								<td>
									<div className={styles.progressBar}>
										<div
											className={styles.progress}
											style={{
												backgroundColor: backgroundColor(series),
												width: progress(series),
											}}
										></div>

										<div className={styles.detailText}>
											{series?.episode_count - series?.missing_episodes}/
											{series?.episode_count}
										</div>
									</div>
								</td>
							)}
							{settings?.media_table_showEpisodeCount == "1" && (
								<td>{series?.episode_count}</td>
							)}
							{settings?.media_table_showYear == "1" && (
								<td>{series?.first_air_date}</td>
							)}
							{settings?.media_table_showPath == "1" && (
								<td>/series/{series.id}</td>
							)}
							{settings?.media_table_showSpaceSaved == "1" && (
								<td>{formatSize(series.space_saved)}</td>
							)}
							{settings?.media_table_showSizeOnDisk == "1" && (
								<td>{formatSize(series.size)}</td>
							)}
							{settings?.media_table_showSizeSaved == "1" && (
								<td>{formatSize(series.space_saved)}</td>
							)}
							{settings?.media_table_showGenre == "1" && (
								<td>{series.genre}</td>
							)}
						</tr>
					))}
				</tbody>
			</Table>
		</div>
	);
};
export default MediaTable;
