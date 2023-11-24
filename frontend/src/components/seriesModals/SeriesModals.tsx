import styles from "./SeriesModals.module.scss";
import useProfiles from "../../hooks/useProfiles";

const SeriesModals = ({ type, content, setContent, data }: any) => {
	const EditContent = () => {
		const p = useProfiles();
		const profiles: any = [];
		for (let i in p) {
			profiles.push(p[i]);
		}
		return (
			<div className={styles.content}>
				<div>
					<label>
						Monitored
						<input
							type="checkbox"
							checked={content.monitored}
							onChange={(e) =>
								setContent({ ...content, monitored: e.target.checked })
							}
						/>
					</label>
				</div>
				<div>
					<label>
						Select an Option
						<select
							value={content.profile}
							onChange={(e) => {
								setContent({ ...content, profile: e.target.value });
							}}
						>
							{profiles.map((profile: any) => (
								<option value={profile.id}>{profile.name}</option>
							))}
						</select>
					</label>
				</div>
			</div>
		);
	};

	return type === "edit" ? <EditContent /> : <></>;
};
export default SeriesModals;
