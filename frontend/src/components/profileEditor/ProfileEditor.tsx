import ProfileAudio from "../profileAudio/ProfileAudio";
import ProfileDimensions from "../profileDimensions/ProfileDimensions";
import ProfileFilters from "../profileFilters/ProfileFilters";
import ProfileSubtitles from "../profileSubtitles/ProfileSubtitles";
import ProfileSummary from "../profileSummary/ProfileSummary";
import ProfileVideo from "../profileVideo/ProfileVideo";
import styles from "./ProfileEditor.module.scss";
const ProfileEditor = ({
	tabSelected,
	setTabSelected,
	content,
	setContent,
	containers,
	codecs,
	encoders,
}: any) => {
	return (
		<div className={styles.content}>
			<div className={styles.tabs}>
				<div
					className={styles.tab}
					onClick={() => setTabSelected("summary")}
					style={
						tabSelected == "summary"
							? { backgroundColor: "var(--transfigurrPurple)", color: "white" }
							: {}
					}
				>
					Summary
				</div>
				<div
					className={styles.tab}
					onClick={() => setTabSelected("dimensions")}
					style={
						tabSelected == "dimensions"
							? { backgroundColor: "var(--transfigurrPurple)", color: "white" }
							: {}
					}
				>
					Dimensions
				</div>
				<div
					className={styles.tab}
					onClick={() => setTabSelected("filters")}
					style={
						tabSelected == "filters"
							? { backgroundColor: "var(--transfigurrPurple)", color: "white" }
							: {}
					}
				>
					Filters
				</div>
				<div
					className={styles.tab}
					onClick={() => setTabSelected("video")}
					style={
						tabSelected == "video"
							? { backgroundColor: "var(--transfigurrPurple)", color: "white" }
							: {}
					}
				>
					Video
				</div>
				<div
					className={styles.tab}
					onClick={() => setTabSelected("audio")}
					style={
						tabSelected == "audio"
							? { backgroundColor: "var(--transfigurrPurple)", color: "white" }
							: {}
					}
				>
					Audio
				</div>
				<div
					className={styles.tab}
					onClick={() => setTabSelected("subtitles")}
					style={
						tabSelected == "subtitles"
							? { backgroundColor: "var(--transfigurrPurple)", color: "white" }
							: {}
					}
				>
					Subtitles
				</div>
			</div>
			{tabSelected === "summary" && (
				<ProfileSummary
					content={content}
					setContent={setContent}
					codecs={codecs}
					containers={containers}
				/>
			)}
			{tabSelected === "dimensions" && (
				<ProfileDimensions
					content={content}
					setContent={setContent}
					codecs={codecs}
					containers={containers}
				/>
			)}
			{tabSelected === "filters" && (
				<ProfileFilters content={content} setContent={setContent} />
			)}
			{tabSelected === "video" && (
				<ProfileVideo
					content={content}
					setContent={setContent}
					codecs={codecs}
					containers={containers}
					encoders={encoders}
				/>
			)}
			{tabSelected === "audio" && (
				<ProfileAudio content={content} setContent={setContent} />
			)}
			{tabSelected === "subtitles" && (
				<ProfileSubtitles content={content} setContent={setContent} />
			)}
		</div>
	);
};
export default ProfileEditor;
