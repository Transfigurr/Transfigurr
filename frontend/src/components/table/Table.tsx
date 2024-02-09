import styles from "./Table.module.scss";
import { ReactComponent as BookmarkFilled } from "../svgs/bookmark_filled.svg";
import { ReactComponent as BookmarkUnfilled } from "../svgs/bookmark_unfilled.svg";
import { ReactComponent as ContinuingIcon } from "../svgs/play_arrow.svg";
import { ReactComponent as StoppedIcon } from "../svgs/stop.svg";
const Table = ({ settings, profiles, sortedSeries }: any) => {
	return (
		<div className={styles.tableContainer}>
			<table className={styles.table}>
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
									<BookmarkFilled className={styles.monitored} />
								) : (
									<BookmarkUnfilled className={styles.monitored} />
								)}
								{series?.status !== "Ended" ? (
									<ContinuingIcon className={styles.continue} />
								) : (
									<StoppedIcon className={styles.stopped} />
								)}
							</td>
							<td>
								<a href={"/series/" + series?.id} className={styles.name}>
									{series?.id}
								</a>
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
								<td>{series?.episode_count}</td>
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
								<td>{(series.space_saved / 1000000000).toFixed(2)} GB</td>
							)}
							{settings?.media_table_showSizeOnDisk == "1" && (
								<td>{(series.size / 1000000000).toFixed(2)} GB</td>
							)}
							{settings?.media_table_showSizeSaved == "1" && (
								<td>{(series.space_saved / 1000000000).toFixed(2)} GB</td>
							)}
							{settings?.media_table_showGenre == "1" && (
								<td>{series.genre}</td>
							)}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};
export default Table;
