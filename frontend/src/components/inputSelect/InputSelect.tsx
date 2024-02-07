import styles from "./InputSelect.module.scss";

const InputSelect = ({ selected, onChange, children }: any) => {
	return (
		<select className={styles.select} value={selected} onChange={onChange}>
			{children}
		</select>
	);
};

export default InputSelect;
