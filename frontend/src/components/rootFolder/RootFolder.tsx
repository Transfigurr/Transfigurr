import styles from "./RootFolder.module.scss";

const RootFolder = () => {
	const rootFolders = [
		{ path: "/tv", freeSpace: "782.3GGB", unmappedFolders: 0 },
		{},
	];

	return (
		<div className={styles.rootFolder}>
			<div className={styles.header}>Root Folders</div>
			<div className={styles.table}>
				<tr>
					<th>Path</th>
					<th>Free Space</th>
					<th>Unmapped Folders</th>
				</tr>
				{rootFolders.map((rootFolder: any) => (
					<tr key={rootFolder.path}>
						<th>{rootFolder.path}</th>
						<th>{rootFolder.freeSpace}</th>
						<th>{rootFolder.unmappedFolders}</th>
					</tr>
				))}
			</div>
			<div className={styles.button}>Choose Another Folder</div>
		</div>
	);
};
export default RootFolder;
