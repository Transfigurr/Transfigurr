import ToolBar from "../../ToolBar/ToolBar";
import ToolBarItem from "../../ToolBarItem/ToolBarItem";
import { ReactComponent as SortIcon } from "../../svgs/sort.svg";
import { ReactComponent as FilterIcon } from "../../svgs/filter.svg";
const MassEditorToolbar = ({ selected, setSelected, settings }: any) => {
	const setSetting = async (key: string, value: any) => {
		if (key == "massEditor_sort" && value == settings.massEditor_sort) {
			await fetch(`http://${window.location.hostname}:7889/api/settings`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
				body: JSON.stringify({
					id: "massEditor_sort_direction",
					value:
						settings?.massEditor_sort_direction === "ascending"
							? "descending"
							: "ascending",
				}),
			});
		}
		await fetch(`http://${window.location.hostname}:7889/api/settings`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
			body: JSON.stringify({ id: key, value: value }),
		});
	};

	const rightToolBarItems: any = [
		<ToolBarItem
			text="Sort"
			index={4}
			key={4}
			settings={settings}
			sortDirection={settings?.massEditor_sort_direction}
			sort={true}
			icon={
				<SortIcon
					style={{
						height: "100%",
						width: "100%",
					}}
				/>
			}
			selected={selected}
			setSelected={setSelected}
			dropdownItems={[
				{
					text: "Monitored/Status",
					id: "monitored/status",
					key: "monitored/status",
					setting_id: "massEditor_sort",
					onClick: () => setSetting("massEditor_sort", "monitored/status"),
				},
				{
					text: "Title",
					id: "title",
					key: "title",
					setting_id: "massEditor_sort",
					onClick: () => setSetting("massEditor_sort", "title"),
				},
				{
					text: "Network",
					id: "network",
					key: "network",
					setting_id: "massEditor_sort",
					onClick: () => setSetting("massEditor_sort", "network"),
				},
				{
					text: "Profile",
					id: "profile",
					key: "profile",
					setting_id: "massEditor_sort",
					onClick: () => setSetting("massEditor_sort", "profile"),
				},
				{
					text: "Episode Count",
					id: "episodes",
					key: "episodes",
					setting_id: "massEditor_sort",
					onClick: () => setSetting("massEditor_sort", "episodes"),
				},
				{
					text: "Size On Disk",
					id: "size",
					key: "size",
					setting_id: "massEditor_sort",
					onClick: () => setSetting("massEditor_sort", "size"),
				},
			]}
		/>,
		<ToolBarItem
			text="Filter"
			index={5}
			key={5}
			icon={
				<FilterIcon
					style={{
						height: "100%",
						width: "100%",
					}}
				/>
			}
			selected={selected}
			settings={settings}
			setSelected={setSelected}
			dropdownItems={[
				{
					text: "All",
					id: "all",
					key: "all",
					setting_id: "massEditor_filter",
					onClick: () => setSetting("massEditor_filter", "all"),
				},
				{
					text: "Monitored Only",
					id: "monitored",
					key: "monitored",
					setting_id: "massEditor_filter",
					onClick: () => setSetting("massEditor_filter", "monitored"),
				},
				{
					text: "Unmonitored Only",
					id: "unmonitored",
					key: "unmonitored",
					setting_id: "massEditor_filter",
					onClick: () => setSetting("massEditor_filter", "unmonitored"),
				},
				{
					text: "Continuing Only",
					id: "continuing",
					key: "continuing",
					setting_id: "massEditor_filter",
					onClick: () => setSetting("massEditor_filter", "continuing"),
				},
				{
					text: "Ended Only",
					id: "ended",
					key: "ended",
					setting_id: "massEditor_filter",
					onClick: () => setSetting("massEditor_filter", "ended"),
				},
				{
					text: "Missing Episodes",
					id: "missing",
					key: "missing",
					setting_id: "massEditor_filter",
					onClick: () => setSetting("massEditor_filter", "missing"),
				},
			]}
		/>,
	];
	return <ToolBar rightToolBarItems={rightToolBarItems} />;
};
export default MassEditorToolbar;
