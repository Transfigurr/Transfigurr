import SideBarItem from "../sideBarItem/SideBarItem";
import styles from "./SideBar.module.scss";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SettingsIcon from "@mui/icons-material/Settings";
import LaptopMacIcon from "@mui/icons-material/LaptopMac";

const MenuComponent = ({
	selectedItem,
	setSelectedItem,
	selectedOption,
}: any) => {
	const mediaOptions = {
		id: 0,
		text: "Media",
		svg: <PlayArrowIcon />,
		link: "/",
		children: [
			{
				text: "Library Import",
				link: "/library-import",
			},
			{
				text: "Mass Editor",
				link: "/mass-editor",
			},
		],
	};

	const activityOptions = {
		id: 1,
		text: "Activity",
		svg: <AccessTimeIcon />,
		link: "/activity",
		children: [
			{
				text: "Queue",
				link: "/activity/queue",
			},
			{
				text: "History",
				link: "/activity/history",
			},
		],
	};

	const settingsOptions = {
		id: 2,
		text: "Settings",
		svg: <SettingsIcon />,
		link: "/settings",
		children: [
			{
				text: "Media Management",
				link: "/settings/media-management",
			},
			{
				text: "Profiles",
				link: "/settings/profiles",
			},
			{
				text: "General",
				link: "/settings/general",
			},
		],
	};

	const systemOptions = {
		id: 3,
		text: "System",
		svg: <LaptopMacIcon />,
		link: "/system/status",
		children: [
			{
				text: "Status",
				link: "/system/status",
			},
		],
	};

	return (
		<div className={styles.sideBar}>
			<div>
				<SideBarItem
					setSelectedItem={setSelectedItem}
					selectedItem={selectedItem}
					selectedOption={selectedOption}
					options={mediaOptions}
					selected={selectedOption === 0}
				/>
			</div>
			<div>
				<SideBarItem
					setSelectedItem={setSelectedItem}
					selectedOption={selectedOption}
					selectedItem={selectedItem}
					options={activityOptions}
					selected={selectedOption === 1}
				/>
			</div>
			<div>
				<SideBarItem
					setSelectedItem={setSelectedItem}
					selectedOption={selectedOption}
					selectedItem={selectedItem}
					options={settingsOptions}
					selected={selectedOption === 2}
				/>
			</div>

			<div>
				<SideBarItem
					setSelectedItem={setSelectedItem}
					selectedOption={selectedOption}
					selectedItem={selectedItem}
					options={systemOptions}
					selected={selectedOption === 3}
				/>
			</div>
		</div>
	);
};
export default MenuComponent;
