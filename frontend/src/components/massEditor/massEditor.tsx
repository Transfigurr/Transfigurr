import styles from "./MassEditor.module.scss";
import { useContext, useEffect, useState } from "react";
import { WebSocketContext } from "../../contexts/webSocketContext";
import InputSelect from "../inputs/inputSelect/InputSelect";
import MassEditorToolbar from "../toolbars/massEditorToolbar/MassEditorToolbar";
import sortAndFilter from "../../utils/sortAndFilter";
import MassEditorTable from "../tables/massEditorTable/MassEditorTable";

const MassEditor = () => {
	const wsContext: any = useContext(WebSocketContext);
	const series: any = wsContext?.data?.series;
	const settings: any = wsContext?.data?.settings;
	const seriesArray = Array.from(Object.values(series || {}));
	const profiles: any = wsContext?.data?.profiles;
	const [selectedSeries, setSelectedSeries] = useState<any>([]);
	const [monitored, setMonitored] = useState<any>(false);
	const [profile, setProfile] = useState<any>();
	const [selected, setSelected] = useState<string | null>(null);
	const [selectAll, setSelectAll] = useState(false);

	const sort = settings?.massEditor_sort;
	const sortDirection = settings?.massEditor_sort_direction;
	const filter = settings?.massEditor_filter;
	const sortedSeries = sortAndFilter(
		series,
		profiles,
		sort,
		sortDirection,
		filter
	);

	const handleCheckboxChange = (series: any) => {
		setSelectedSeries((prevSelected: any[]) =>
			prevSelected.some((s) => s.id === series.id)
				? prevSelected.filter((s) => s.id !== series.id)
				: [...prevSelected, series]
		);
	};
	const handleSelectAllChange = () => {
		setSelectAll(!selectAll);
		setSelectedSeries(!selectAll ? seriesArray : []);
	};

	useEffect(() => {
		const applyChanges = () => {
			for (const series of selectedSeries) {
				series.monitored =
					parseInt(monitored) !== -1 ? parseInt(monitored) : undefined;
				series.profile_id =
					parseInt(profile) !== 0 ? parseInt(profile) : undefined;
				fetch(
					`http://${window.location.hostname}:7889/api/series/${series.id}`,
					{
						method: "PUT",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${localStorage.getItem("token")}`,
						},

						body: JSON.stringify(series),
					}
				);
			}
		};
		applyChanges();
	}, [monitored, profile, selectedSeries]);

	return (
		<div className={styles.massEditor}>
			<MassEditorToolbar
				selected={selected}
				setSelected={setSelected}
				settings={settings}
			/>
			<div className={styles.content}>
				{sortedSeries && sortedSeries.length !== 0 ? (
					<MassEditorTable
						sortedSeries={sortedSeries}
						selectedSeries={selectedSeries}
						selectAll={selectAll}
						handleSelectAllChange={handleSelectAllChange}
						handleCheckboxChange={handleCheckboxChange}
						profiles={profiles}
					/>
				) : (
					<>No Media Found</>
				)}
			</div>
			<div className={styles.footer}>
				<div className={styles.input}>
					<div className={styles.inputContainer}>
						<label className={styles.label}>Monitored </label>
						<InputSelect
							selected={monitored}
							onChange={(e: any) => {
								setMonitored(e.target.value);
							}}
						>
							<option value={-1}>{"No Change"}</option>
							<option value={0}>{"Not Monitored"}</option>
							<option value={1}>{"Monitored"}</option>
						</InputSelect>
					</div>
					<div className={styles.inputContainer}>
						<label className={styles.label}>Profile </label>
						<InputSelect
							selected={profile}
							onChange={(e: any) => {
								setProfile(e.target.value);
							}}
						>
							<option value={0}>{"No Change"}</option>
							{Object.values(profiles || {}).map(
								(profile: any, index: number) => (
									<option value={profile.id} key={index}>
										{profile.name}
									</option>
								)
							)}
						</InputSelect>
					</div>
				</div>
			</div>
		</div>
	);
};
export default MassEditor;
