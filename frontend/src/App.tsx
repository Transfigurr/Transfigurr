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
import { useState } from "react";

function App() {
	const [selectedItem, setSelectedItem] = useState<number>(-1);
	const [selectedOption, setSelectedOption] = useState<number>(0);

	const page = () => {
		if (selectedOption === 0) {
			if (selectedItem === -1) {
				return <MediaComponent />;
			} else if (selectedItem === 0) {
				return <LibraryImport />;
			} else if (selectedItem === 1) {
				return <MassEditor />;
			}
		} else if (selectedOption === 1) {
			if (selectedItem === -1) {
				setSelectedItem(0);
			} else if (selectedItem === 0) {
				return <Queue />;
			} else if (selectedItem === 1) {
				return <History />;
			}
		} else if (selectedOption === 2) {
			if (selectedItem === -1) {
				return <Settings setSelectedItem={setSelectedItem} />;
			} else if (selectedItem === 0) {
				return <MediaManagement />;
			} else if (selectedItem === 1) {
				return <Profiles />;
			} else if (selectedItem === 2) {
				return <General />;
			} else if (selectedItem === 3) {
				return <UI />;
			}
		} else if (selectedOption === 3) {
			if (selectedItem === -1) {
				setSelectedItem(0);
			} else if (selectedItem === 0) {
				return <Status />;
			} else if (selectedItem === 1) {
				return <Tasks />;
			} else if (selectedItem === 2) {
				return <Backup />;
			} else if (selectedItem === 3) {
				return <Updates />;
			} else if (selectedItem === 4) {
				return <Events />;
			} else if (selectedItem === 5) {
				return <LogFiles />;
			}
		}
	};
	return (
		<div className={styles.app}>
			<HeaderComponent />
			<div className={styles.content}>
				<SideBar
					selectedOption={selectedOption}
					setSelectedOption={setSelectedOption}
					selectedItem={selectedItem}
					setSelectedItem={setSelectedItem}
				/>
				{page()}
			</div>
		</div>
	);
}

export default App;
