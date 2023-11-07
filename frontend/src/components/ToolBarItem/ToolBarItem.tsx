import styles from "./ToolBarItem.module.scss";
const ToolBarOption = ({ icon, text }: any) => {
	return (
		<div className={styles.toolBarOption}>
			<div className={styles.svg}>{icon}</div>
			<div className={styles.text}>{text}</div>
		</div>
	);
};
export default ToolBarOption;
