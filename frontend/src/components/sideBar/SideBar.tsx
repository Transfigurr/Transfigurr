import SideBarItem from "../sideBarItem/SideBarItem";
import styles from "./SideBar.module.scss";
import { ReactComponent as MediaIcon } from "../svgs/play_arrow.svg";
import { ReactComponent as ActivityIcon } from "../svgs/schedule.svg";
import { ReactComponent as SettingsIcon } from "../svgs/settings.svg";
import { ReactComponent as SystemIcon } from "../svgs/laptop.svg";

import { useLocation } from "react-router";
import { useEffect } from "react";

const MenuComponent = ({
	selectedItem,
	setSelectedItem,
	selectedOption,
	setSelectedOption,
}: any) => {
	const location: any = useLocation();
	const pathname: string = location.pathname;
	const sidebar: any = {
		"/": [0, -1],
		"/mass-editor": [0, 0],
		"/activity": [1, -1],
		"/activity/queue": [1, 0],
		"/activity/history": [1, 1],

		"/settings": [2, -1],
		"/settings/media-management": [2, 0],
		"/settings/profiles": [2, 0],
		"/settings/general": [2, 1],
		"/system": [3, -1],
		"/system/status": [3, 0],
	};

	useEffect(() => {
		setSelectedOption(pathname in sidebar ? sidebar[pathname][0] : 0);
		setSelectedItem(pathname in sidebar ? sidebar[pathname][1] : -1);
	}, [pathname]);

	const mediaOptions = {
		id: 0,
		text: "Media",
		svg: (
			<MediaIcon
				style={{
					height: "100%",
					width: "100%",
				}}
			/>
		),
		link: "/",
		children: [
			{
				text: "Mass Editor",
				link: "/mass-editor",
			},
		],
	};

	const activityOptions = {
		id: 1,
		text: "Activity",
		svg: (
			<ActivityIcon
				style={{
					height: "100%",
					width: "100%",
				}}
			/>
		),
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
		svg: (
			<SettingsIcon
				style={{
					height: "100%",
					width: "100%",
				}}
			/>
		),
		link: "/settings",
		children: [
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
		svg: (
			<SystemIcon
				style={{
					height: "100%",
					width: "100%",
				}}
			/>
		),
		link: "/system/status",
		children: [
			{
				text: "Status",
				link: "/system/status",
			},
		],
	};

	return (
		<>
			{selectedItem !== null && selectedOption !== null ? (
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
			) : null}
		</>
	);
};
export default MenuComponent;
