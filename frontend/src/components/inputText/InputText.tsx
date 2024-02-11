import styles from "./InputText.module.scss";
const InputText = ({ selected, onChange, type }: any) => {
	return (
		<input
			className={styles.inputText}
			type={type}
			value={selected}
			onChange={onChange}
		/>
	);
};
export default InputText;
