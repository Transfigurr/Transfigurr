import styles from "./Header.module.scss";
import PersonIcon from "@mui/icons-material/Person";
const HeaderComponent = () => {
	return (
		<div className={styles.header}>
			<div className={styles.left}>
				<div className={styles.logo}>
					<img
						className={styles.svg}
						src={process.env.PUBLIC_URL + "/Logo/Sonarr.svg"}
						alt="logo"
					/>
				</div>
			</div>
			<div className={styles.right}>
				<div className={styles.profile}>
					<PersonIcon />
				</div>
			</div>
		</div>
	);
};
export default HeaderComponent;
