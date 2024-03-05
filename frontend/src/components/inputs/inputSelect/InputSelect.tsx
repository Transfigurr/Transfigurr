import styles from "./InputSelect.module.scss";

const InputSelect = ({ selected, onChange, children, disabled }: any) => {
	return (
		<select
			className={styles.select}
			value={selected}
			onChange={onChange}
			disabled={disabled}
		>
			{children}
		</select>
	);
};

export default InputSelect;
