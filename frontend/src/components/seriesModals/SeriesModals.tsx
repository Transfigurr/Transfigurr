import styles from "./SeriesModals.module.scss";

const SeriesModals = ({ type, content, setContent, data }: any) => {
	const EditContent = () => {
		const p = data;
		const profiles: any = [];
		for (let i in p) {
			profiles.push(p[i]);
		}
		console.log(content);
		console.log(data);
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
							value={content.profile_id}
							onChange={(e) => {
								setContent({ ...content, profile_id: e.target.value });
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
