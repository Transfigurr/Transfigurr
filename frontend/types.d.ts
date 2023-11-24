export type Series = {
	id: number;
	name: string;
	first_air_date: string;
	genre: string;
	last_air_date: string;
	networks: string[];
	overview: string;
	series_path: string;
	seasons: Record<number, Season>;
	profile: Profile;
};

export type Season = {
	name: string;
	season_number: number;
	episode_count: number;
	overview: string;
	season_path: string;
	episodes: Episode[];
};
export type Episode = {
	name: string;
	season_name: string;
	season_number: number;
	episode_name: string;
	episode_number: number;
	video_codec: string;
};

export type Profile = {};
