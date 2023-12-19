import styles from "./App.module.scss";
import HeaderComponent from "./components/header/Header";
import SideBar from "./components/sideBar/SideBar";
import MediaComponent from "./components/media/Media";
import LibraryImport from "./components/libraryImport/LibraryImport";
import MassEditor from "./components/massEditor/massEditor";
import Queue from "./components/queue/Queue";
import History from "./components/history/History";
import Settings from "./components/settings/Settings";
import Profiles from "./components/profiles/Profiles";
import MediaManagement from "./components/mediaManagement/MediaManagement";
import General from "./components/general/General";
import UI from "./components/ui/UI";
import Status from "./components/status/Status";
import Tasks from "./components/tasks/Tasks";
import Backup from "./components/backup/Backup";
import Updates from "./components/updates/Updates";
import Events from "./components/events/Events";
import LogFiles from "./components/logFiles/LogFiles";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
	BrowserRouter as Router,
	Route,
	Routes,
	Link,
	useNavigate,
	Outlet,
	useParams,
	useLocation,
	BrowserRouter,
} from "react-router-dom";
import Series from "./components/series/Series";
import themes, { getTheme } from "./styles/themes";
import useSettings from "./hooks/useSettings";

function App() {
	const [selectedItem, setSelectedItem] = useState<any>(null);
	const [selectedOption, setSelectedOption] = useState<any>(null);

	const settings: any = useSettings();
	const [theme, setTheme] = useState<any>(null);
	let t = null;
	useEffect(() => {
		if (settings) {
			setTheme(settings[5]?.value);
		}
	}, [settings]);
	console.log("apptheme", theme);

	t = getTheme(theme); // replace with actual theme property
	console.log(t);
	if (t) {
		Object.entries(t).forEach(([key, value]) => {
			document.documentElement.style.setProperty(`--${key}`, value);
		});
	}
	return (
		<Router>
			{t ? (
				<div className={styles.app}>
					<HeaderComponent />
					<div className={styles.content}>
						<div className={styles.sideBar}>
							<SideBar
								selectedOption={selectedOption}
								setSelectedOption={setSelectedOption}
								selectedItem={selectedItem}
								setSelectedItem={setSelectedItem}
							/>
						</div>
						<div className={styles.page}>
							<Page
								setSelectedOption={setSelectedOption}
								setSelectedItem={setSelectedItem}
							/>
						</div>
					</div>
				</div>
			) : null}
		</Router>
	);

	function Page({ setSelectedOption, setSelectedItem }: any) {
		const location: any = useLocation();
		const pathname: string = location.pathname;
		const sidebar: any = {
			"/": [0, -1],
			"/mass-editor": [0, 0],
			"/activity": [1, -1],
			"/activity/queue": [1, 0],
			"/activity/history": [1, 1],

			"/settings": [2, -1],
			"/settings/profiles": [2, 0],
			"/settings/general": [2, 1],
			"/system": [3, -1],
			"/system/status": [3, 0],
		};

		setSelectedOption(pathname in sidebar ? sidebar[pathname][0] : 0);
		setSelectedItem(pathname in sidebar ? sidebar[pathname][1] : -1);

		return (
			<Routes>
				<Route path="/" element={<MediaComponent />} />
				<Route path="/series/:seriesName" element={<SeriesSelect />} />
				<Route path="/library-import" element={<LibraryImport />} />
				<Route path="/mass-editor" element={<MassEditor />} />

				<Route path="/activity" element={<Activity />} />
				<Route path="/activity/queue" element={<Queue />} />
				<Route path="/activity/history" element={<History />} />

				<Route path="/settings" element={<Settings />} />
				<Route
					path="/settings/media-management"
					element={<MediaManagement />}
				/>
				<Route path="/settings/profiles" element={<Profiles />} />
				<Route path="/settings/general" element={<General />} />
				<Route path="/settings/status" element={<Status />} />
				<Route path="/system" element={<Status />} />

				<Route path="/system/status" element={<Status />} />

				{<Route path="*" element={<NotFound />} />}
			</Routes>
		);
	}

	function Activity() {
		const navigate = useNavigate();

		useEffect(() => {
			navigate("/activity/queue");
		}, [navigate]);
		return null;
	}
	function SeriesSelect() {
		const { seriesName } = useParams();
		return <Series series_name={seriesName} />;
	}

	function NotFound() {
		const navigate = useNavigate();

		useEffect(() => {
			navigate("/");
		}, [navigate]);
		return null;
	}
}

export default App;
