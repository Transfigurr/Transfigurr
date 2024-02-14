import { useContext, useEffect, useRef, useState } from "react";
import styles from "./General.module.scss";
import { WebSocketContext } from "../../contexts/webSocketContext";
import ToolBar from "../ToolBar/ToolBar";
import ToolBarItem from "../ToolBarItem/ToolBarItem";
import { ReactComponent as SaveIcon } from "../svgs/save.svg";
import InputContainer from "../inputContainer/InputContainer";

const General = () => {
	const wsContext = useContext(WebSocketContext);
	const initialSettings = wsContext?.data?.settings;
	const profiles = wsContext?.data?.profiles;
	const [currentSettings, setCurrentSettings] = useState<any>({});
	const hasSetCurrentSettings = useRef(false);
	const [settingsChanged, setSettingsChanged] = useState(false);
	const [selected, setSelected] = useState<string | null>(null);
	const [user, setUser] = useState<any>();
	useEffect(() => {
		if (initialSettings !== undefined && !hasSetCurrentSettings.current) {
			setCurrentSettings({
				...initialSettings,
				password: "passwordplaceholder",
			});
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
			if (key != "username" && key != "password") {
				fetch(`http://${window.location.hostname}:7889/api/settings`, {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${localStorage.getItem("token")}`,
					},
					body: JSON.stringify({ id: key, value: currentSettings[key] }),
				});
			} else {
				if (key == "username") {
					fetch(`http://${window.location.hostname}:7889/api/user`, {
						method: "PUT",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${localStorage.getItem("token")}`,
						},
						body: JSON.stringify({
							username: currentSettings["username"],
							password: currentSettings["password"],
						}),
					});
				}
			}
		}
		setSettingsChanged(false);
	};
	const leftToolBarItems: any = [
		<ToolBarItem
			text={!settingsChanged ? "No Changes" : "Save"}
			key="save"
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
				<div className={styles.section}>
					<label className={styles.header}>Default Behavior</label>
					<InputContainer
						type="select"
						label="Default Profile"
						selected={currentSettings?.default_profile}
						onChange={(e: any) =>
							handleChange("default_profile", e.target.value)
						}
					>
						{Object.entries(profiles || {})?.map(([key, profile]: any) => (
							<option key={key} value={key}>
								{profile?.name}
							</option>
						))}
					</InputContainer>

					<InputContainer
						type="select"
						label="Queue State"
						selected={currentSettings?.queue_status}
						onChange={(e: any) => handleChange("queue_status", e.target.value)}
					>
						<option value="active">Active</option>
						<option value="inactive">Inactive</option>
					</InputContainer>

					<InputContainer
						type="select"
						label="Queue Startup State"
						selected={currentSettings?.queue_startup_state}
						onChange={(e: any) =>
							handleChange("queue_startup_state", e.target.value)
						}
					>
						<option value="previous">Previous</option>
						<option value="inactive">Inactive</option>
						<option value="active">Active</option>
					</InputContainer>
				</div>
				<div className={styles.section}>
					<label className={styles.header}>User Interface</label>
					<InputContainer
						type="select"
						label="Theme"
						selected={currentSettings?.theme}
						onChange={(e: any) => handleChange("theme", e.target.value)}
					>
						<option value="auto">Auto</option>
						<option value="light">Light</option>
						<option value="dark">Dark</option>
					</InputContainer>
				</div>
				<div className={styles.section}>
					<label className={styles.header}>Security</label>
					<InputContainer
						type="text"
						label="Username"
						warningText="Requires restart to take effect"
						selected={currentSettings?.username}
						onChange={(e: any) => handleChange("username", e.target.value)}
					/>
					<InputContainer
						type="password"
						label="Password"
						warningText="Requires restart to take effect"
						selected={currentSettings?.password}
						onChange={(e: any) => handleChange("password", e.target.value)}
					/>
				</div>
				<div className={styles.section}>
					<label className={styles.header}>Logging</label>
					<InputContainer
						type="select"
						label="Log Level"
						warningText="Requires restart to take effect"
						selected={currentSettings?.log_level}
						onChange={(e: any) => handleChange("log_level", e.target.value)}
					>
						<option value="info">Info</option>
						<option value="debug">Debug</option>
					</InputContainer>
				</div>
			</div>
		</div>
	);
};
export default General;
