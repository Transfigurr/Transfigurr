import { useState, useEffect, useContext } from "react";
import styles from "./MediaManagement.module.scss";
import { WebSocketContext } from "../../contexts/webSocketContext";

const MediaManagement = () => {
	const wsContext = useContext(WebSocketContext);
	const initialSettings: any = wsContext?.data?.settings;
	const [settings, setSettings] = useState([]);

	useEffect(() => {
		const s: any = [];
		for (const i in initialSettings) {
			s.push(initialSettings[i]);
		}
		setSettings(s);
	}, [initialSettings]);

	const handleInputChange = (name: any, value: any) => {
		const updatedSettings: any = settings.map((setting: any) =>
			setting.name === name ? { ...setting, value } : setting,
		);
		setSettings(updatedSettings);
	};

	const saveSettings = async () => {
		await fetch(`http://${window.location.hostname}:7889/api/settings`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ settings: settings }),
		});
	};

	return (
		<div className={styles.mediaManagement}>
			{settings.map((setting: any) => (
				<div key={setting.name}>
					<label>
						{setting.name}
						<input
							type="input"
							value={setting.value}
							onChange={(e) => handleInputChange(setting.name, e.target.value)}
						/>
					</label>
				</div>
			))}
			<input type="submit" onClick={saveSettings} />
		</div>
	);
};

export default MediaManagement;
