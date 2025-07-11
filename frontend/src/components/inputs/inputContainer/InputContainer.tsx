import InputCheckbox from "../inputCheckbox/InputCheckbox";
import InputSelect from "../inputSelect/InputSelect";
import InputText from "../inputText/InputText";
import GroupedAutocomplete from "../groupedAutocomplete/GroupedAutocomplete";
import styles from "./InputContainer.module.scss";
const InputContainer = ({
	type,
	label = "",
	helpText = "",
	warningText = "",
	selected,
	onChange,
	children,
	checked,
	disabled = false,
	data, // For GroupedAutocomplete
	placeholder, // For GroupedAutocomplete
}: any) => {
	return (
		<div
			className={styles.inputContainer}
			style={disabled ? { opacity: ".5" } : {}}
		>
			<div className={styles.inputLine}>
				<label className={styles.label}>{label}</label>
				<div className={styles.inputColumn}>
					<div className={styles.inputRow}>
						{type === "text" && (
							<InputText
								type="input"
								selected={selected}
								onChange={onChange}
								disabled={disabled}
							/>
						)}
						{type === "password" && (
							<InputText
								type="password"
								selected={selected}
								onChange={onChange}
								disabled={disabled}
							/>
						)}
						{type === "select" && (
							<InputSelect
								type="input"
								selected={selected}
								onChange={onChange}
								disabled={disabled}
							>
								{children}
							</InputSelect>
						)}
						{type === "checkbox" && (
							<InputCheckbox
								type="input"
								checked={checked}
								onChange={onChange}
								disabled={disabled}
							/>
						)}
						{type === "grouped-autocomplete" && (
							<GroupedAutocomplete
								data={data}
								value={selected}
								onChange={onChange}
								placeholder={placeholder}
								disabled={disabled}
							/>
						)}
						<label className={styles.helpText}>{helpText}</label>
					</div>
					<label className={styles.warningText}>{warningText}</label>
				</div>
			</div>
		</div>
	);
};
export default InputContainer;
