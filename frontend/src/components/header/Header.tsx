import styles from "./Header.module.scss";
import { ReactComponent as Person } from "../svgs/person.svg";
import { ReactComponent as Logo } from "../svgs/transfigurr.svg";
import { WebSocketContext } from "../../contexts/webSocketContext";
import { useContext } from "react";
const HeaderComponent = () => {
	const wsContext = useContext(WebSocketContext);
	const queue = wsContext?.data?.queue;
	return (
		<div className={styles.header}>
			<div className={styles.left}>
				<div className={styles.logo}>
					<Logo
						style={{
							height: "100%",
							width: "100%",
							fill: "var(--transfigurrPurple)",
						}}
					/>
				</div>
				<div className={styles.status}>
					<div className={styles.statusText}>
						{Math.floor(parseInt(queue?.eta || 0) / 60).toString() +
							"m:" +
							(parseInt(queue?.eta || 0) % 60).toString() +
							"s"}
					</div>
					<div className={styles.statusText}>{queue?.stage || "-"}</div>

					<div className={styles.statusText}></div>
				</div>
			</div>
			<div className={styles.right}>
				<div className={styles.profile}>
					<Person style={{ height: "100%", width: "100%" }} />
				</div>
			</div>
		</div>
	);
};
export default HeaderComponent;
