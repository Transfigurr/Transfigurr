import ToolBar from "../../ToolBar/ToolBar";
import ToolBarItem from "../../ToolBarItem/ToolBarItem";
import { ReactComponent as Pause } from "../../svgs/pause_circle.svg";
import { ReactComponent as Start } from "../../svgs/play_circle.svg";
import { ReactComponent as TableIcon } from "../../svgs/table.svg";

const QueueToolbar = ({
	settings,
	setContent,
	setIsModalOpen,
	selected,
	setSelected,
}: any) => {
	const handleOptionsClick = () => {
		setContent(settings);
		setIsModalOpen(true);
	};
	const setSetting = async (key: string, value: any) => {
		await fetch(`http://${window.location.hostname}:7889/api/settings`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
			body: JSON.stringify({ id: key, value: value }),
		});
	};

	const middleToolBarItems: any = [
		<ToolBarItem
			text="Status"
			index={4}
			key={4}
			settings={settings}
			icon={
				settings?.queue_status === "inactive" ? (
					<Pause
						style={{
							height: "100%",
							width: "100%",
						}}
					/>
				) : (
					<Start
						style={{
							height: "100%",
							width: "100%",
						}}
					/>
				)
			}
			selected={selected}
			setSelected={setSelected}
			dropdownItems={[
				{
					text: "Active",
					id: "active",
					key: "active",
					setting_id: "queue_status",
					onClick: () => setSetting("queue_status", "active"),
				},
				{
					text: "Inactive",
					id: "inactive",
					key: "inactive",
					setting_id: "queue_status",
					onClick: () => setSetting("queue_status", "inactive"),
				},
			]}
		/>,
	];
	const rightToolbarItems: any = [
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
	];
	return (
		<ToolBar
			leftToolBarItems={[]}
			middleToolBarItems={middleToolBarItems}
			rightToolBarItems={rightToolbarItems}
		/>
	);
};

export default QueueToolbar;
