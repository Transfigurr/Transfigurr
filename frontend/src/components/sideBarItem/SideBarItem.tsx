import styles from "./SideBarItem.module.scss";
import { Link } from "react-router-dom";

const SideBarItem = ({
	options,
	selected,
	selectedItem,
	setSelectedItem,
}: any) => {
	return (
		<div
			className={styles.sideBarItem}
			style={selected ? { borderLeft: "3px solid #9338b5" } : {}}
		>
			<Link
				to={options.link}
				className={styles.mainItem}
				style={
					selected
						? {
								color: "var(--transfigurrPurple)",
								backgroundColor: "#252833",
								fill: "var(--transfigurrPurple)",
							}
						: {}
				}
				onClick={() => {
					setSelectedItem(-1);
				}}
			>
				<div className={styles.svg}>{options.svg}</div>
				{options.text}
			</Link>
			{selected ? (
				options.children.map((child: any, index: any) => (
					<Link
						to={child.link}
						className={styles.childItem}
						key={index}
						style={
							selectedItem === index
								? {
										color: "var(--transfigurrPurple)",
										fill: "var(--transfigurrPurple)",
									}
								: {}
						}
					>
						{child.text}
					</Link>
				))
			) : (
				<></>
			)}
		</div>
	);
};
export default SideBarItem;
