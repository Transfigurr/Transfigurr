import styles from "./Overviews.module.scss";
import Overview from "../overview/Overview";

const Overviews = ({ sortedMedia, settings, profiles }: any) => {
	return (
		<div className={styles.overviews}>
			{sortedMedia.map((media: any, index: number) => (
				<Overview
					media={media}
					settings={settings}
					profiles={profiles}
					key={index}
				/>
			))}
		</div>
	);
};
export default Overviews;
