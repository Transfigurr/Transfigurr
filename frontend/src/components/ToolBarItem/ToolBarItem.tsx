import styles from "./ToolBarItem.module.scss";
import { ReactComponent as CheckmarkIcon } from "../svgs/check.svg";
import { useEffect, useRef } from "react";
const ToolBarOption = ({
	icon,
	index,
	text,
	settings,
	disabled,
	dropdownItems,
	selected,
	setSelected,
	onClick = () => {
		undefined;
	},
}: any) => {
	const changeSelected = (index: number) => {
		onClick();
		if (selected === index) {
			setSelected(-1);
		} else {
			setSelected(index);
		}
	};
	const dropdownRef: any = useRef(null);

	useEffect(() => {
		function handleClickOutside(event: any) {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setSelected(-1);
			}
		}

		if (selected === index) {
			document.addEventListener("mousedown", handleClickOutside);
		} else {
			document.removeEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [selected, index, setSelected]);

	return (
		<>
			<div
				ref={dropdownRef}
				className={styles.toolBarOption}
				onClick={() => changeSelected(index)}
				style={
					disabled ? { opacity: "50%", cursor: "default", fill: "white" } : {}
				}
			>
				<div className={styles.svg}>{icon}</div>
				<div className={styles.text}>{text}</div>
				{selected === index && (
					<div className={styles.dropdown}>
						{dropdownItems?.map((item: any) => (
							<>
								<div className={styles.item} onClick={item?.onClick}>
									<div className={styles.text}>{item?.text}</div>
									{item?.id === settings[item?.setting_id] || "" ? (
										<div className={styles.svg}>
											<CheckmarkIcon
												style={{ height: "20px", width: "20px" }}
											/>
										</div>
									) : (
										<></>
									)}
								</div>
							</>
						))}
					</div>
				)}
			</div>
		</>
	);
};
export default ToolBarOption;
