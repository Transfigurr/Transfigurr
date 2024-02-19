import styles from "./Overviews.module.scss";
import Overview from "../overview/Overview";

const Overviews = ({ sortedSeries, settings, profiles }: any) => {
	return (
		<div className={styles.overviews}>
			{sortedSeries.map((series: any, index: number) => (
				<Overview
					series={series}
					settings={settings}
					profiles={profiles}
					key={index}
				/>
			))}
		</div>
	);
};
export default Overviews;
