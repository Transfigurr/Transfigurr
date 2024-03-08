import styles from "./InputCheckbox.module.scss";
const InputCheckbox = ({
	checked,
	onChange,
	height = "20px",
	width = "20px",
	disabled,
}: any) => {
	return (
		<div
			className={styles.inputCheckboxContainer}
			style={{ height: height, width: width }}
		>
			<input
				type="checkbox"
				disabled={disabled}
				className={styles.inputCheckbox}
				style={{ height: height, width: width }}
				checked={checked}
				onChange={onChange}
			/>
			<span
				className={styles.checkmark}
				style={{ height: height, width: width }}
			/>
		</div>
	);
};

export default InputCheckbox;
