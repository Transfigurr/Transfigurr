package models

import "time"

type Settings struct {
	ID                               int       `json:"-" db:"id"`
	Theme                            string    `json:"theme" db:"theme"`
	DefaultProfile                   int       `json:"defaultProfile" db:"default_profile"`
	QueueStatus                      string    `json:"queueStatus" db:"queue_status"`
	QueueStartupState                string    `json:"queueStartupState" db:"queue_startup_state"`
	LogLevel                         string    `json:"logLevel" db:"log_level"`
	MediaView                        string    `json:"mediaView" db:"media_view"`
	MediaSort                        string    `json:"mediaSort" db:"media_sort"`
	MediaSortDirection               string    `json:"mediaSortDirection" db:"media_sort_direction"`
	MediaFilter                      string    `json:"mediaFilter" db:"media_filter"`
	MassEditorSort                   string    `json:"massEditorSort" db:"mass_editor_sort"`
	MassEditorSortDirection          string    `json:"massEditorSortDirection" db:"mass_editor_sort_direction"`
	MassEditorFilter                 string    `json:"massEditorFilter" db:"mass_editor_filter"`
	MediaPosterSize                  string    `json:"mediaPosterSize" db:"media_poster_size"`
	MediaPosterDetailedProgressBar   bool      `json:"mediaPosterDetailedProgressBar" db:"media_poster_detailed_progress_bar"`
	MediaPosterShowTitle             bool      `json:"mediaPosterShowTitle" db:"media_poster_show_title"`
	MediaPosterShowMonitored         bool      `json:"mediaPosterShowMonitored" db:"media_poster_show_monitored"`
	MediaPosterShowProfile           bool      `json:"mediaPosterShowProfile" db:"media_poster_show_profile"`
	MediaTableShowNetwork            bool      `json:"mediaTableShowNetwork" db:"media_table_show_network"`
	MediaTableShowProfile            bool      `json:"mediaTableShowProfile" db:"media_table_show_profile"`
	MediaTableShowSeasons            bool      `json:"mediaTableShowSeasons" db:"media_table_show_seasons"`
	MediaTableShowEpisodes           bool      `json:"mediaTableShowEpisodes" db:"media_table_show_episodes"`
	MediaTableShowEpisodeCount       bool      `json:"mediaTableShowEpisodeCount" db:"media_table_show_episode_count"`
	MediaTableShowYear               bool      `json:"mediaTableShowYear" db:"media_table_show_year"`
	MediaTableShowType               bool      `json:"mediaTableShowType" db:"media_table_show_type"`
	MediaTableShowSizeOnDisk         bool      `json:"mediaTableShowSizeOnDisk" db:"media_table_show_size_on_disk"`
	MediaTableShowSizeSaved          bool      `json:"mediaTableShowSizeSaved" db:"media_table_show_size_saved"`
	MediaTableShowGenre              bool      `json:"mediaTableShowGenre" db:"media_table_show_genre"`
	MediaOverviewPosterSize          string    `json:"mediaOverviewPosterSize" db:"media_overview_poster_size"`
	MediaOverviewDetailedProgressBar bool      `json:"mediaOverviewDetailedProgressBar" db:"media_overview_detailed_progress_bar"`
	MediaOverviewShowMonitored       bool      `json:"mediaOverviewShowMonitored" db:"media_overview_show_monitored"`
	MediaOverviewShowNetwork         bool      `json:"mediaOverviewShowNetwork" db:"media_overview_show_network"`
	MediaOverviewShowProfile         bool      `json:"mediaOverviewShowProfile" db:"media_overview_show_profile"`
	MediaOverviewShowSeasonCount     bool      `json:"mediaOverviewShowSeasonCount" db:"media_overview_show_season_count"`
	MediaOverviewShowPath            bool      `json:"mediaOverviewShowPath" db:"media_overview_show_path"`
	MediaOverviewShowSizeOnDisk      bool      `json:"mediaOverviewShowSizeOnDisk" db:"media_overview_show_size_on_disk"`
	QueueFilter                      string    `json:"queueFilter" db:"queue_filter"`
	QueuePageSize                    int       `json:"queuePageSize" db:"queue_page_size"`
	HistoryFilter                    string    `json:"historyFilter" db:"history_filter"`
	HistoryPageSize                  int       `json:"historyPageSize" db:"history_page_size"`
	EventsFilter                     string    `json:"eventsFilter" db:"events_filter"`
	EventsPageSize                   int       `json:"eventsPageSize" db:"events_page_size"`
	Port                             int       `json:"port" db:"port"`
	CreatedAt                        time.Time `json:"createdAt" db:"created_at"`
	UpdatedAt                        time.Time `json:"updatedAt" db:"updated_at"`
}
