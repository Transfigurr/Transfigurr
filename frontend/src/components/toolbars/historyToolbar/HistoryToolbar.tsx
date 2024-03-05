import ToolBar from "../../ToolBar/ToolBar";
import ToolBarItem from "../../ToolBarItem/ToolBarItem";
import { ReactComponent as TableIcon } from "../../svgs/table.svg";

const HistoryToolbar = ({
	settings,
	selected,
	setSelected,
	handleOptionsClick,
}: any) => {
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
