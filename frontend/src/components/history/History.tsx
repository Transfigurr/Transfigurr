import styles from "./History.module.scss";
import { WebSocketContext } from "../../contexts/webSocketContext";
import { useContext, useState } from "react";
import HistoryToolbar from "../toolbars/historyToolbar/HistoryToolbar";
import HistoryModal from "../modals/historyModal/HistoryModal";
import HistoryTable from "../tables/historyTable/HistoryTable";

const History = () => {
	const wsContext: any = useContext(WebSocketContext);
	const settings: any = wsContext?.data?.settings;
	const history = wsContext?.data?.history;
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [content, setContent] = useState({});
	const [selected, setSelected] = useState(null);
	const historyArray = Array.from(Object.values(history || {}));

	return (
		<div className={styles.history}>
			<HistoryToolbar
				settings={settings}
				setContent={setContent}
				setIsModalOpen={setIsModalOpen}
				selected={selected}
				setSelected={setSelected}
			/>
			<HistoryModal
				isOpen={isModalOpen}
				setIsOpen={setIsModalOpen}
				content={content}
				setContent={setContent}
			/>
			<div className={styles.content}>
				{historyArray && historyArray.length !== 0 ? (
					<HistoryTable historyArray={historyArray} settings={settings} />
				) : (
					<>History is empty</>
				)}
			</div>
		</div>
	);
};
export default History;
