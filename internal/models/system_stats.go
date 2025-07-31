package models

import "time"

type SystemStats struct {
	Id                  int       `json:"id"`
	StartTime           time.Time `json:"start_time"`
	SeriesCount         int       `json:"series_count"`
	EpisodeCount        int       `json:"episode_count"`
	FilesCount          int       `json:"files_count"`
	SizeOnDisk          int64     `json:"size_on_disk"`
	SpaceSaved          int64     `json:"space_saved"`
	MonitoredCount      int       `json:"monitored_count"`
	UnmonitoredCount    int       `json:"unmonitored_count"`
	EndedCount          int       `json:"ended_count"`
	ContinuingCount     int       `json:"continuing_count"`
	SeriesTotalSpace    int64     `json:"series_total_space"`
	SeriesFreeSpace     int64     `json:"series_free_space"`
	MoviesTotalSpace    int64     `json:"movies_total_space"`
	MoviesFreeSpace     int64     `json:"movies_free_space"`
	ConfigTotalSpace    int64     `json:"config_total_space"`
	ConfigFreeSpace     int64     `json:"config_free_space"`
	TranscodeTotalSpace int64     `json:"transcode_total_space"`
	TranscodeFreeSpace  int64     `json:"transcode_free_space"`
	CreatedAt           time.Time `json:"created_at"`
	UpdatedAt           time.Time `json:"updated_at"`
}
