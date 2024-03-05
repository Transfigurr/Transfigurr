import ToolBar from "../../ToolBar/ToolBar";
import ToolBarItem from "../../ToolBarItem/ToolBarItem";
import { ReactComponent as SaveIcon } from "../../svgs/save.svg";

const GeneralToolbar = ({
	selected,
	setSelected,
	handleSave,
	settingsChanged,
}: any) => {
	const leftToolBarItems: any = [
		<ToolBarItem
			text={!settingsChanged ? "No Changes" : "Save"}
			key="save"
			icon={<SaveIcon fontSize="medium" />}
			onClick={handleSave}
			disabled={!settingsChanged}
			selected={selected}
			setSelected={setSelected}
		/>,
	];
	return <ToolBar leftToolBarItems={leftToolBarItems} />;
};
export default GeneralToolbar;
