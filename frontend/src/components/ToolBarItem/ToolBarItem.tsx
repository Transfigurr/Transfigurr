import styles from "./ToolBarItem.module.scss";
const ToolBarOption = ({ icon, text, onClick }: any) => {
	return (
		<div className={styles.toolBarOption} onClick={onClick}>
			<div className={styles.svg}>{icon}</div>
			<div className={styles.text}>{text}</div>
		</div>
	);
};
export default ToolBarOption;
