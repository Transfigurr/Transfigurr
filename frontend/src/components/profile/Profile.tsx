import styles from "./Profile.module.scss";
import { ReactComponent as AddIcon } from "../svgs/add.svg";
import Codec from "../codec/Codec";
const Profile = ({ name, type = "", codecs, onClick, profile }: any) => {
	return (
		<div className={styles.profile} key={name} onClick={() => onClick(profile)}>
			{type === "add" ? (
				<div className={styles.add}>
					<div className={styles.box}>
						{<AddIcon style={{ fill: "var(--textColor)" }} />}
					</div>
				</div>
			) : (
				<div className={styles.normal}>
					<div className={styles.header}>{name}</div>
					<div className={styles.codecs}>
						{codecs.map((codec: any) => (
							<Codec key={codec} codec={codec} />
						))}
					</div>
				</div>
			)}
		</div>
	);
};
export default Profile;
