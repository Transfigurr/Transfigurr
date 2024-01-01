import { useContext, useEffect, useMemo, useState } from "react";
import styles from "./General.module.scss";
import { WebSocketContext } from "../../contexts/webSocketContext";
const General = () => {
	const wsContext = useContext(WebSocketContext);

	const initialSettings = useMemo(() => wsContext?.data?.settings, []);

	const [currentSettings, setCurrentSettings] = useState<any>(initialSettings);

	const handleSubmit = (event: any) => {
		for (let i in currentSettings) {
			fetch(`http://localhost:8000/api/settings`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(currentSettings[i]),
			});
		}
	};
	return (
		<div className={styles.general}>
			<div className={styles.content}>
				<form onSubmit={handleSubmit} className={styles.form}>
					<label>
						Default Profile:
						<select
							value={currentSettings?.default_profile}
							onChange={(e) => {
								setCurrentSettings({
									...currentSettings,
									default_profile: e.target.value,
								});
							}}
						>
							<option value="auto">Auto</option>
							<option value="dark">Dark</option>
							<option value="light">Light</option>
						</select>
					</label>
					<label>
						Queue Startup State:
						<select
							value={currentSettings?.queue_startup_state}
							onChange={(e) => {
								setCurrentSettings({
									...currentSettings,
									queue_startup_state: e.target.value,
								});
							}}
						>
							<option value="previous">Previous</option>
							<option value="dark">Dark</option>
							<option value="light">Light</option>
						</select>
					</label>
					<label>
						Theme:
						<select
							value={currentSettings?.theme}
							onChange={(e) => {
								setCurrentSettings({
									...currentSettings,
									theme: e.target.value,
								});
							}}
						>
							<option value="auto">Auto</option>
							<option value="dark">Dark</option>
							<option value="light">Light</option>
						</select>
					</label>
					<button type="submit">Submit</button>
				</form>
			</div>
		</div>
	);
};
export default General;
