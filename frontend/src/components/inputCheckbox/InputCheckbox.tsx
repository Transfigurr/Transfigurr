import styles from "./InputCheckbox.module.scss";
const InputCheckbox = ({
	checked,
	onChange,
	height = "20px",
	width = "20px",
}: any) => {
	return (
		<div
			className={styles.inputCheckboxContainer}
			style={{ height: height, width: width }}
		>
			<input
				type="checkbox"
				className={styles.inputCheckbox}
				style={{ height: height, width: width }}
				checked={checked}
				onChange={onChange}
			/>
			<span
				className={styles.checkmark}
				style={{ height: height, width: width }}
			></span>
		</div>
	);
};

export default InputCheckbox;
