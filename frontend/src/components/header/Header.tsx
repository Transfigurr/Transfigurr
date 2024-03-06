import styles from "./Header.module.scss";
import { ReactComponent as Person } from "../svgs/person.svg";
import { ReactComponent as Logo } from "../svgs/transfigurr.svg";
import { WebSocketContext } from "../../contexts/webSocketContext";
import { useContext, useEffect, useRef, useState } from "react";
import { ReactComponent as Timer } from "../svgs/timer.svg";
import { ReactComponent as Build } from "../svgs/build.svg";
import { ReactComponent as Pending } from "../svgs/pending.svg";
import { ReactComponent as RestartIcon } from "../svgs/restart.svg";
import { ReactComponent as ShutdownIcon } from "../svgs/shutdown.svg";
import { Link } from "react-router-dom";
import { formatETA } from "../../utils/format";

const HeaderComponent = () => {
	const wsContext = useContext(WebSocketContext);
	const queue = wsContext?.data?.queue;
	const [openDropdown, setOpenDropdown] = useState(false);
	const dropdownRef: any = useRef(null);

	useEffect(() => {
		function handleClickOutside(event: any) {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setOpenDropdown(false);
			}
		}

		if (openDropdown) {
			document.addEventListener("mousedown", handleClickOutside);
		} else {
			document.removeEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [openDropdown]);

	const shutdown = async () => {
		await fetch(
			`http://${window.location.hostname}:7889/api/actions/shutdown`,
			{
				method: "PUT",
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			},
		);
	};

	const restart = async () => {
		await fetch(`http://${window.location.hostname}:7889/api/actions/restart`, {
			method: "PUT",
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
		});
	};

	const settings = wsContext?.data?.settings;

	return (
		<div className={styles.header}>
			<div className={styles.left}>
				<Link to="/" className={styles.logo}>
					<Logo
						style={{
							height: "100%",
							width: "100%",
							fill: "var(--transfigurrPurple)",
						}}
					/>
				</Link>
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
							{queue && queue.stage !== "idle" && formatETA(queue?.eta)}
						</div>
					</div>
					<div className={styles.line}>
						<div className={styles.icon}>
							<Build />
						</div>

						<div className={styles.text}>
							{settings?.queue_status == "active"
								? queue?.stage || "--"
								: "paused"}
						</div>
					</div>
				</div>
			</div>
			<div className={styles.right}>
				<div className={styles.profile}>
					<Person
						className={styles.svg}
						style={{ height: "100%", width: "100%" }}
						onClick={() => setOpenDropdown(!openDropdown)}
						ref={dropdownRef}
					/>
					{openDropdown ? (
						<div className={styles.dropdown}>
							<div className={styles.item} onClick={restart}>
								<div className={styles.profilesvg}>
									<RestartIcon style={{ height: "100%", width: "100%" }} />
								</div>
								<div className={styles.text}>Restart</div>
							</div>
							<div className={styles.item} onClick={shutdown}>
								<div className={styles.profilesvg}>
									<ShutdownIcon style={{ height: "100%", width: "100%" }} />
								</div>
								<div className={styles.text}>Shutdown</div>
							</div>
						</div>
					) : (
						<></>
					)}
				</div>
			</div>
		</div>
	);
};
export default HeaderComponent;
