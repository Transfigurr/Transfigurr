import { useContext, useEffect, useMemo, useRef, useState } from "react";
import styles from "./General.module.scss";
import { WebSocketContext } from "../../contexts/webSocketContext";
import ToolBar from "../ToolBar/ToolBar";
import ToolBarItem from "../ToolBarItem/ToolBarItem";
import { ReactComponent as SaveIcon } from "../svgs/save.svg";

const General = () => {
	const wsContext = useContext(WebSocketContext);
	const initialSettings = wsContext?.data?.settings;
	const profiles = wsContext?.data?.profiles;
	const [currentSettings, setCurrentSettings] = useState<any>();
	const hasSetCurrentSettings = useRef(false);
	const [settingsChanged, setSettingsChanged] = useState(false);

	useEffect(() => {
		if (initialSettings !== undefined && !hasSetCurrentSettings.current) {
			setCurrentSettings(initialSettings);
			hasSetCurrentSettings.current = true;
		}
	}, [initialSettings]);

	const handleChange = (key: string, value: any) => {
		setCurrentSettings((prevSettings: any) => {
			const newSettings = {
				...prevSettings,
				[key]: value,
			};

			// Compare newSettings with initialSettings
			setSettingsChanged(
				JSON.stringify(newSettings) !== JSON.stringify(initialSettings)
			);

			return newSettings;
		});
	};

	const handleSave = () => {
		if (!settingsChanged) {
			return;
		}
		for (let key in currentSettings) {
			fetch(`http://localhost:8000/api/settings`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ id: key, value: currentSettings[key] }),
			});
		}
		setSettingsChanged(false);
	};
	const leftToolBarItems: any = [
		<ToolBarItem
			text={!settingsChanged ? "No Changes" : "Save"}
			icon={<SaveIcon fontSize="medium" />}
			onClick={handleSave}
			disabled={!settingsChanged}
		/>,
	];
	return (
		<div className={styles.general}>
			<ToolBar leftToolBarItems={leftToolBarItems} />
			<div className={styles.content}>
				<div className={styles.inputContainer}>
					<label>Default Profile</label>
					<select
						className={styles.select}
						value={currentSettings?.default_profile}
						onChange={(e) => handleChange("default_profile", e.target.value)}
					>
						{Object.entries(profiles || {})?.map(([key, profile]: any) => (
							<option value={key}>{profile?.name}</option>
						))}
					</select>
				</div>
				<div className={styles.inputContainer}>
					<label>Queue Startup State</label>
					<select
						className={styles.select}
						value={currentSettings?.queue_startup_state}
						onChange={(e) =>
							handleChange("queue_startup_state", e.target.value)
						}
					>
						<option value="previous">Previous</option>
						<option value="inactive">Inactive</option>
						<option value="active">Active</option>
					</select>
				</div>
				<div className={styles.inputContainer}>
					<label>Theme</label>
					<select
						className={styles.select}
						value={currentSettings?.theme}
						onChange={(e) => handleChange("theme", e.target.value)}
					>
						<option value="auto">Auto</option>
						<option value="light">Light</option>
						<option value="dark">Dark</option>
					</select>
				</div>
			</div>
		</div>
	);
};
export default General;
