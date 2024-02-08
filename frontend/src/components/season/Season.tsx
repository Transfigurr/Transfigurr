import { useState } from "react";
import styles from "./Season.module.scss";
import { ReactComponent as Open } from "../svgs/expand_circle_up.svg";
import { ReactComponent as Close } from "../svgs/expand_circle_down.svg";
const Season = ({ season }: any) => {
	const [isOpen, setIsOpen] = useState(false);
	const onSeasonClick = () => {
		setIsOpen(!isOpen);
	};
	return (
		<div className={styles.season}>
			<div className={styles.seasonHeader} onClick={onSeasonClick}>
				<div className={styles.left}>
					<div className={styles.seasonNumber}>{season?.name}</div>
					<div className={styles.profileRatio}>
						{season?.episode_count - season?.missing_episodes} /{" "}
						{season?.episode_count}
					</div>
					<div className={styles.size}>
						{(season?.size / 1000000000).toFixed(2).toString() + " GB"}
					</div>
				</div>
				<div className={styles.center}>
					<div className={styles.open}>
						{isOpen ? (
							<>
								<Open />
							</>
						) : (
							<Close />
						)}
					</div>
				</div>
			</div>
			<div
				className={styles.seasonInfo}
				style={isOpen ? {} : { display: "none" }}
			>
				<table>
					<thead>
						<tr>
							<th>#</th>
							<th>Title</th>
							<th>Air Date</th>
							<th>Status</th>
							<th>Size</th>
						</tr>
					</thead>
					<tbody>
						{Object.values(season.episodes || {})
							.reverse()
							.map((episode: any) => (
								<tr>
									<td>{episode?.episode_number}</td>
									<td>
										{episode?.episode_name
											? episode.episode_name
											: episode.filename}
									</td>
									<td>
										{episode?.air_date
											? new Date(episode?.air_date).toLocaleString("en-US", {
													month: "short",
												}) +
												" " +
												new Date(episode?.air_date).getDate() +
												" " +
												new Date(episode?.air_date).getFullYear()
											: ""}
									</td>
									<td>{episode?.video_codec}</td>
									<td>
										{(episode?.size / 1000000000).toFixed(2).toString() + " GB"}
									</td>
								</tr>
							))}
					</tbody>
				</table>
				<div className={styles.seasonInfoFooter} onClick={onSeasonClick}>
					<Open />
				</div>
			</div>
		</div>
	);
};
export default Season;
