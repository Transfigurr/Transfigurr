import styles from "./InputText.module.scss";
const InputText = ({ selected, onChange }: any) => {
	return (
		<input
			className={styles.inputText}
			type="input"
			value={selected}
			onChange={onChange}
		/>
	);
};
export default InputText;
