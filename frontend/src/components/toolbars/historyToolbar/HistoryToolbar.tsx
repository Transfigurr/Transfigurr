import styles from "./HistoryToolbar.module.scss";
import ToolBar from "../../toolBar/ToolBar";
import ToolBarItem from "../../toolBarItem/ToolBarItem";
import TableIcon from "../../svgs/table.svg?react";

const HistoryToolbar = ({
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
	return (
		<ToolBar
			leftToolBarItems={[]}
			middleToolBarItems={[]}
			rightToolBarItems={[
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
		/>
	);
};
export default HistoryToolbar;
