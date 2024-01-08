import styles from "./Header.module.scss";
import { ReactComponent as Person } from "../svgs/person.svg";
import { ReactComponent as Logo } from "../svgs/transfigurr.svg";
import { WebSocketContext } from "../../contexts/webSocketContext";
import { useContext } from "react";
import { ReactComponent as Timer } from "../svgs/timer.svg";
import { ReactComponent as Build } from "../svgs/build.svg";
import { ReactComponent as Pending } from "../svgs/pending.svg";

const HeaderComponent = () => {
	const wsContext = useContext(WebSocketContext);
	const queue = wsContext?.data?.queue;
	return (
		<div className={styles.header}>
			<div className={styles.left}>
				<a href="/" className={styles.logo}>
					<Logo
						style={{
							height: "100%",
							width: "100%",
							fill: "var(--transfigurrPurple)",
						}}
					/>
				</a>
				<div className={styles.status}>
					<div className={styles.line}>
						<div className={styles.icon}>
							<Timer style={{ fill: "white", height: "15px" }} />
						</div>
						<div className={styles.text}>
							{queue && queue.stage !== "idle"
								? Math.floor(queue?.progress)
								: "--"}
							%
						</div>
					</div>
					<div className={styles.line}>
						<div className={styles.icon}>
							<Pending />
						</div>
						<div className={styles.text}>
							{queue && queue.stage !== "idle"
								? Math.floor(parseInt(queue?.eta || 0) / 60) +
									"m " +
									(parseInt(queue?.eta || 0) % 60).toString() +
									"s"
								: "-m -s"}
						</div>
					</div>
					<div className={styles.line}>
						<div className={styles.icon}>
							<Build />
						</div>
						<div className={styles.text}>{queue?.stage || "--"}</div>
					</div>
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
