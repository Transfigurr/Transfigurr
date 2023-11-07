import styles from "./Profile.module.scss";
import AddIcon from "@mui/icons-material/Add";
const Profile = ({ header, type = "" }: any) => {
	const onProfileClick = (type: string) => {
		console.log(type);
	};

	const codecs = [
		"264",
		"264",
		"ISO",
		"265",
		"DVD",
		"H265",
		"SDTV",
		"WEBDL",
		"WEB 1080p",
	];

	return (
		<div
			className={styles.profile}
			key={header}
			onClick={() => onProfileClick(type)}
		>
			{type === "add" ? (
				<div className={styles.add}>
					<div className={styles.box}>{<AddIcon fontSize="large" />}</div>
				</div>
			) : (
				<div className={styles.normal}>
					<div className={styles.header}>{header}</div>
					<div className={styles.codecs}>
						{codecs.map((codec: any) => (
							<div className={styles.codec} key={header + "-" + codec}>
								{codec}
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
};
export default Profile;
