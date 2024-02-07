import { useContext, useEffect, useRef, useState } from "react";
import styles from "./General.module.scss";
import { WebSocketContext } from "../../contexts/webSocketContext";
import ToolBar from "../ToolBar/ToolBar";
import ToolBarItem from "../ToolBarItem/ToolBarItem";
import { ReactComponent as SaveIcon } from "../svgs/save.svg";
import InputSelect from "../inputSelect/InputSelect";

const General = () => {
	const wsContext = useContext(WebSocketContext);
	const initialSettings = wsContext?.data?.settings;
	const profiles = wsContext?.data?.profiles;
	const [currentSettings, setCurrentSettings] = useState<any>();
	const hasSetCurrentSettings = useRef(false);
	const [settingsChanged, setSettingsChanged] = useState(false);
	const [selected, setSelected] = useState<string | null>(null);

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

			setSettingsChanged(
				JSON.stringify(newSettings) !== JSON.stringify(initialSettings),
			);

			return newSettings;
		});
	};

	const handleSave = () => {
		if (!settingsChanged) {
			return;
		}
		for (const key in currentSettings) {
			fetch(`http://${window.location.hostname}:7889/api/settings`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("token")}`,
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
			selected={selected}
			setSelected={setSelected}
		/>,
	];
	return (
		<div className={styles.general}>
			<ToolBar leftToolBarItems={leftToolBarItems} />
			<div className={styles.content}>
				<div className={styles.inputContainer}>
					<label className={styles.label}>Default Profile</label>
					<InputSelect
						selected={currentSettings?.default_profile}
						onChange={(e: any) =>
							handleChange("default_profile", e.target.value)
						}
					>
						{Object.entries(profiles || {})?.map(([key, profile]: any) => (
							<option value={key}>{profile?.name}</option>
						))}
					</InputSelect>
				</div>
				<div className={styles.inputContainer}>
					<label className={styles.label}>Queue Startup State</label>
					<InputSelect
						selected={currentSettings?.queue_startup_state}
						onChange={(e: any) =>
							handleChange("queue_startup_state", e.target.value)
						}
					>
						<option value="previous">Previous</option>
						<option value="inactive">Inactive</option>
						<option value="active">Active</option>
					</InputSelect>
				</div>
				<div className={styles.inputContainer}>
					<label className={styles.label}>Theme</label>
					<InputSelect
						selected={currentSettings?.theme}
						onChange={(e: any) => handleChange("theme", e.target.value)}
					>
						<option value="auto">Auto</option>
						<option value="light">Light</option>
						<option value="dark">Dark</option>
					</InputSelect>
				</div>
			</div>
		</div>
	);
};
export default General;
