import ToolBar from "../../ToolBar/ToolBar";
import ToolBarItem from "../../ToolBarItem/ToolBarItem";
import { ReactComponent as TableIcon } from "../../svgs/table.svg";
import { ReactComponent as FilterIcon } from "../../svgs/filter.svg";
const EventsToolbar = ({
	selected,
	setSelected,
	handleOptionsClick,
	setSetting,
	settings,
}: any) => {
	return (
		<ToolBar
			leftToolBarItems={[]}
			middleToolBarItems={[
				<ToolBarItem
					text="Options"
					index={2}
					key={2}
					settings={settings}
					icon={
						<TableIcon
							style={{
								height: "100%",
								width: "100%",
							}}
						/>
					}
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
