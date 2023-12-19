import { useEffect, useState } from "react";
import styles from "./General.module.scss";
import useSettings from "../../hooks/useSettings";
const General = () => {
	const settings: any = useSettings();

	const [currentSettings, setCurrentSettings] = useState<any>({});
	useEffect(() => {
		if (settings) {
			setCurrentSettings(settings);
		}
	}, [settings]);
	const handleSubmit = (event: any) => {
		console.log(currentSettings);
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
		<form onSubmit={handleSubmit} className={styles.form}>
			<label>
				Theme:
				<select
					value={currentSettings[5]?.value}
					onChange={(e) => {
						setCurrentSettings({
							...currentSettings,
							[5]: { ...currentSettings[5], value: e.target.value },
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
	);
};
export default General;
