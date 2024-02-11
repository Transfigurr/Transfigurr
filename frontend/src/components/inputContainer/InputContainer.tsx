import InputSelect from "../inputSelect/InputSelect";
import InputText from "../inputText/InputText";
import styles from "./InputContainer.module.scss";
const InputContainer = ({
	type,
	label = "",
	helpText = "",
	selected,
	onChange,
	children,
}: any) => {
	return (
		<div className={styles.inputContainer}>
			<div className={styles.inputLine}>
				<label className={styles.label}>{label}</label>
				<div className={styles.inputColumn}>
					{type === "text" && (
						<InputText type="input" selected={selected} onChange={onChange} />
					)}
					{type === "password" && (
						<InputText
							type="password"
							selected={selected}
							onChange={onChange}
						/>
					)}
					{type === "select" && (
						<InputSelect type="input" selected={selected} onChange={onChange}>
							{children}
						</InputSelect>
					)}
					<label className={styles.helpText}>{helpText}</label>
				</div>
			</div>
		</div>
	);
};
export default InputContainer;
