import styles from "./ToolBar.module.scss";

const clickUpdate = () => {
	console.log("Update");
};

const clickRSS = () => {
	console.log("RSS");
};

const clickOptions = () => {
	console.log("Options");
};

const clickView = () => {
	console.log("View");
};

const clickSort = () => {
	console.log("Sort");
};

const clickFilter = () => {
	console.log("Filter");
};

const ToolBar = ({
	leftToolBarItems,
	middleToolBarItems,
	rightToolBarItems,
}: any) => {
	return (
		<div className={styles.toolBar}>
			<div className={styles.left}>{leftToolBarItems}</div>
			<div className={styles.right}>
				{middleToolBarItems}
				<div className={styles.seperator}></div>
				{rightToolBarItems}
			</div>
		</div>
	);
};
export default ToolBar;
