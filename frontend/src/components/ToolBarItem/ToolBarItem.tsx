import styles from "./ToolBarItem.module.scss";
const ToolBarOption = ({ icon, text, onClick, disabled }: any) => {
	return (
		<div
			className={styles.toolBarOption}
			onClick={onClick}
			style={
				disabled ? { opacity: "50%", cursor: "default", fill: "white" } : {}
			}
		>
			<div className={styles.svg}>{icon}</div>
			<div className={styles.text}>{text}</div>
		</div>
	);
};
export default ToolBarOption;
