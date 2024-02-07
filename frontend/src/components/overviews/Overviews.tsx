import Overview from "../overview/Overview";

const Overviews = ({ sortedSeries }: any) => {
	return (
		<>
			{sortedSeries.map((series: any) => (
				<Overview series={series} />
			))}
		</>
	);
};
export default Overviews;
