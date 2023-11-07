import RootFolder from "../rootFolder/RootFolder";
import styles from "./LibraryImport.module.scss";
const LibraryImport = () => {
	return (
		<div className={styles.libraryImport}>
			<div className={styles.header}>Import media you already have</div>
			<div className={styles.body}>
				Some tips to ensure the import goes smoothly:
			</div>
			<ul className={styles.list}>
				<li>
					Make sure that your files include the quality in their filenames. eg.
					episode.s02e15.bluray.mkv
				</li>

				<li>
					Point Sonarr to the folder containing all of your media, not a
					specific one. eg. "/tv shows" and not "/tv shows/the simpsons"
					Additionally, each series must be in its own folder within the
					root/library folder.
				</li>

				<li>
					This is only for existing organized libraries, not unsorted files.
				</li>
			</ul>
			<RootFolder />
		</div>
	);
};
export default LibraryImport;
