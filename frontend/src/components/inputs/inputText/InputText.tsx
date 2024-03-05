import styles from "./InputText.module.scss";
const InputText = ({ selected, onChange, type, disabled }: any) => {
	return (
		<input
			className={styles.inputText}
			type={type}
			value={selected}
			onChange={onChange}
			disabled={disabled}
		/>
	);
};
export default InputText;
