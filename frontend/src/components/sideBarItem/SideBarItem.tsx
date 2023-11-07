import styles from "./SideBarItem.module.scss";

const SideBarItem = ({
	options,
	selected,
	selectedItem,
	setSelectedItem,
}: any) => {
	//const [selectedItem, setSelectedItem] = useState<number>(-1);

	const onItemClick = (option: number) => {
		setSelectedItem(option);
	};
	return (
		<div
			className={styles.sideBarItem}
			style={selected ? { borderLeft: "3px solid #2193b5" } : {}}
		>
			<div
				className={styles.mainItem}
				style={selected ? { color: "#35c5f4", backgroundColor: "#252833" } : {}}
				onClick={() => {
					setSelectedItem(-1);
				}}
			>
				<div className={styles.svg}>{options.svg}</div>
				{options.text}
			</div>
			{selected ? (
				options.children.map((child: any, index: any) => (
					<div
						className={styles.childItem}
						key={index}
						onClick={() => onItemClick(index)}
						style={selectedItem === index ? { color: "#35c5f4" } : {}}
					>
						{child.text}
					</div>
				))
			) : (
				<></>
			)}
		</div>
	);
};
export default SideBarItem;
