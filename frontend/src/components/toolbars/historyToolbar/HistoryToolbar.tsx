import ToolBar from "../../toolBar/ToolBar";
import ToolBarItem from "../../toolBarItem/ToolBarItem";
import { ReactComponent as TableIcon } from "../../svgs/table.svg";

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
		/>
	);
};
export default HistoryToolbar;
