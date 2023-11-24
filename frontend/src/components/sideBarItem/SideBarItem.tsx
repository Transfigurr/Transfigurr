import styles from "./SideBarItem.module.scss";
const SideBarItem = ({
	options,
	selected,
	selectedItem,
	setSelectedItem,
}: any) => {
	const onItemClick = (index: number) => {
		window.location.href = options.children[index].link;
	};
	const onParentClick = () => {
		window.location.href = options.link;
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
					onParentClick();
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
