import styles from "./MediaTable.module.scss";
import BookmarkFilled from "../../svgs/bookmark_filled.svg?react";
import BookmarkUnfilled from "../../svgs/bookmark_unfilled.svg?react";
import ContinuingIcon from "../../svgs/play_arrow.svg?react";
import StoppedIcon from "../../svgs/stop.svg?react";
import { Link } from "react-router-dom";
import { formatSize } from "../../../utils/format";
import Table from "../../table/Table";
import { Tooltip } from "react-tooltip";
const MediaTable = ({ settings, profiles, sortedMedia }: any) => {
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
						<th>Title</th>
						{settings?.media_table_showType == "1" && <th>Type</th>}
						{settings?.media_table_showProfile == "1" && <th>Profile</th>}
						{settings?.media_table_showNetwork == "1" && (
							<th>Network / Studio</th>
						)}
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
					{sortedMedia.map((media: any, key: number) => (
						<tr className={styles.row} key={key}>
							<td className={styles.iconCell}>
								{media?.monitored ? (
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
								{media?.status !== "Ended" ? (
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
								<Tooltip
									id="monitoredTooltip"
									place="top"
									content="Monitored"
								/>
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
								<Link to={"/series/" + media?.id} className={styles.name}>
									{media?.name ? media?.name : media?.id}
								</Link>
							</td>
							<td>{media?.episode_count == undefined ? "Movie" : "Series"}</td>
							{settings?.media_table_showProfile == "1" && (
								<td>{profiles ? profiles[media.profile_id]?.name : ""}</td>
							)}
							{settings?.media_table_showNetwork == "1" && (
								<td>
									{media?.episode_count == undefined
										? media?.studio
										: media?.networks}
								</td>
							)}
							{settings?.media_table_showSeasons == "1" && (
								<td>{media?.seasons_count}</td>
							)}
							{settings?.media_table_showEpisodes == "1" && (
								<td>
									{media?.episode_count != undefined && (
										<div className={styles.progressBar}>
											<div
												className={styles.progress}
												style={{
													backgroundColor: backgroundColor(media),
													width: progress(media),
												}}
											/>
											<div className={styles.detailText}>
												{media?.episode_count - media?.missing_episodes}/
												{media?.episode_count}
											</div>
										</div>
									)}
								</td>
							)}
							{settings?.media_table_showEpisodeCount == "1" && (
								<td>{media?.episode_count}</td>
							)}
							{settings?.media_table_showYear == "1" && (
								<td>{media?.release_date}</td>
							)}
							{settings?.media_table_showPath == "1" && (
								<td>/series/{media.id}</td>
							)}
							{settings?.media_table_showSpaceSaved == "1" && (
								<td>{formatSize(media.space_saved)}</td>
							)}
							{settings?.media_table_showSizeOnDisk == "1" && (
								<td>{formatSize(media.size)}</td>
							)}
							{settings?.media_table_showSizeSaved == "1" && (
								<td>{formatSize(media.space_saved)}</td>
							)}
							{settings?.media_table_showGenre == "1" && <td>{media.genre}</td>}
						</tr>
					))}
				</tbody>
			</Table>
		</div>
	);
};
export default MediaTable;
