import styles from "./ToolBar.module.scss";

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
