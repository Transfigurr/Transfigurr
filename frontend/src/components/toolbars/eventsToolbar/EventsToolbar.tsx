import styles from "./EventsToolbar.module.scss";
import ToolBar from "../../toolBar/ToolBar";
import ToolBarItem from "../../toolBarItem/ToolBarItem";
import TableIcon from "../../svgs/table.svg?react";
import FilterIcon from "../../svgs/filter.svg?react";
const EventsToolbar = ({
	selected,
	setContent,
	setIsModalOpen,
	setSelected,
	settings,
}) => {
	const setSetting = async (key: string, value: any) => {
		await fetch(`/api/settings`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
			body: JSON.stringify({ id: key, value: value }),
		});
	};
	const handleOptionsClick = () => {
		setContent(settings);
		setIsModalOpen(true);
	};

	return (
		<ToolBar
			leftToolBarItems={[]}
			middleToolBarItems={[
				<ToolBarItem
					text="Options"
					index={2}
					key={2}
					settings={settings}
					icon={<TableIcon className={styles.svg} />}
					onClick={handleOptionsClick}
					selected={selected}
					setSelected={setSelected}
				/>,
			]}
			rightToolBarItems={[
				<ToolBarItem
					text="Filter"
					index={5}
					key={5}
					icon={<FilterIcon className={styles.svg} />}
					selected={selected}
					settings={settings}
					setSelected={setSelected}
					dropdownItems={[
						{
							text: "All",
							id: "all",
							key: "all",
							setting_id: "events_filter",
							onClick: () => setSetting("events_filter", "all"),
						},
						{
							text: "Info",
							id: "info",
							key: "info",
							setting_id: "events_filter",
							onClick: () => setSetting("events_filter", "info"),
						},
						{
							text: "Warn",
							id: "warn",
							key: "warn",
							setting_id: "events_filter",
							onClick: () => setSetting("events_filter", "warn"),
						},
						{
							text: "Error",
							id: "error",
							key: "error",
							setting_id: "events_filter",
							onClick: () => setSetting("events_filter", "error"),
						},
					]}
				/>,
			]}
		/>
	);
};
export default EventsToolbar;
