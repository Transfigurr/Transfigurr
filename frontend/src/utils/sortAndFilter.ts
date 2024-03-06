const sortAndFilter = (
	series: object,
	profiles: any,
	sort: string,
	sortDirection: string,
	filter: string,
) => {
	let filteredSeries: any[] = Object.values(series || {});
	if (filter == "monitored") {
		filteredSeries = filteredSeries.filter((series: any) => series.monitored);
	} else if (filter == "unmonitored") {
		filteredSeries = filteredSeries.filter((series: any) => !series.monitored);
	} else if (filter == "continuing") {
		filteredSeries = filteredSeries.filter(
			(series: any) => series.status != "Ended",
		);
	} else if (filter == "ended") {
		filteredSeries = filteredSeries.filter(
			(series: any) => series.status == "Ended",
		);
	} else if (filter == "missing") {
		filteredSeries = filteredSeries.filter(
			(series: any) => series.missing_episodes != 0,
		);
	}

	let sortedSeries: any[] = filteredSeries;
	const sortSeries = (seriesArray: any[], column: string) => {
		return seriesArray.sort((a: any, b: any) => {
			if (typeof a[column] === "string" && typeof b[column] === "string") {
				return a[column].localeCompare(b[column]);
			} else if (
				typeof a[column] === "number" &&
				typeof b[column] === "number"
			) {
				return a[column] - b[column];
			} else {
				return 0;
			}
		});
	};
	if (sort == "title") {
		sortedSeries = sortSeries(sortedSeries, "id");
	} else if (sort == "monitored/status") {
		sortedSeries = sortSeries(sortedSeries, "monitored");
	} else if (sort == "network") {
		sortedSeries = sortSeries(sortedSeries, "networks");
	} else if (sort == "profile") {
		sortedSeries = sortedSeries.map((series: any) => {
			const profile = profiles[series.profile_id];
			return {
				...series,
				profile_id: profile?.name,
			};
		});
		sortedSeries = sortSeries(sortedSeries, "profile_id");
	} else if (sort == "episodes") {
		sortedSeries = sortSeries(sortedSeries, "episode_count");
	} else if (sort == "size") {
		sortedSeries = sortSeries(sortedSeries, "size");
	}
	if (sortDirection === "descending") {
		sortedSeries = sortedSeries.reverse();
	}
	return sortedSeries;
};

export default sortAndFilter;
