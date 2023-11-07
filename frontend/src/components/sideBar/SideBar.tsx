import SideBarItem from "../sideBarItem/SideBarItem";
import styles from "./SideBar.module.scss";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SettingsIcon from "@mui/icons-material/Settings";
import LaptopMacIcon from "@mui/icons-material/LaptopMac";
const MenuComponent = ({
	selectedItem,
	setSelectedItem,
	setSelectedOption,
	selectedOption,
}: any) => {
	const mediaOptions = {
		text: "Media",
		svg: <PlayArrowIcon />,
		children: [
			{
				text: "Library Import",
			},
			{
				text: "Mass Editor",
			},
		],
	};

	const activityOptions = {
		text: "Activity",
		svg: <AccessTimeIcon />,
		children: [
			{
				text: "Queue",
			},
			{
				text: "History",
			},
		],
	};

	const settingsOptions = {
		text: "Settings",
		svg: <SettingsIcon />,
		children: [
			{
				text: "Media Management",
			},
			{
				text: "Profiles",
			},
			{
				text: "General",
			},
		],
	};

	const systemOptions = {
		text: "System",
		svg: <LaptopMacIcon />,
		children: [
			{
				text: "Status",
			},
		],
	};

	const onSideBarClick = (option: number) => {
		setSelectedOption(option);
	};

	return (
		<div className={styles.sideBar}>
			<div onClick={() => onSideBarClick(0)}>
				<SideBarItem
					setSelectedItem={setSelectedItem}
					selectedItem={selectedItem}
					options={mediaOptions}
					selected={selectedOption === 0}
				/>
			</div>
			<div onClick={() => onSideBarClick(1)}>
				<SideBarItem
					setSelectedItem={setSelectedItem}
					selectedItem={selectedItem}
					options={activityOptions}
					selected={selectedOption === 1}
				/>
			</div>
			<div onClick={() => onSideBarClick(2)}>
				<SideBarItem
					setSelectedItem={setSelectedItem}
					selectedItem={selectedItem}
					options={settingsOptions}
					selected={selectedOption === 2}
				/>
			</div>

			<div onClick={() => onSideBarClick(3)}>
				<SideBarItem
					setSelectedItem={setSelectedItem}
					selectedItem={selectedItem}
					options={systemOptions}
					selected={selectedOption === 3}
				/>
			</div>
		</div>
	);
};
export default MenuComponent;
