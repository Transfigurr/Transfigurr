package repositories

import (
	"database/sql"
	"transfigurr/internal/models"
)

type SettingRepository struct {
	DB *sql.DB
}

func NewSettingRepository(db *sql.DB) *SettingRepository {
	return &SettingRepository{
		DB: db,
	}
}

func (repo *SettingRepository) GetSettings() (models.Settings, error) {
	var settings models.Settings
	err := repo.DB.QueryRow(`
        SELECT 
            id, theme, default_profile, queue_status, queue_startup_state,
            log_level, media_view, media_sort, media_sort_direction, media_filter,
            mass_editor_sort, mass_editor_sort_direction, mass_editor_filter,
            media_poster_size, media_poster_detailed_progress_bar,
            media_poster_show_title, media_poster_show_monitored, media_poster_show_profile,
            media_table_show_network, media_table_show_profile, media_table_show_seasons,
            media_table_show_episodes, media_table_show_episode_count, media_table_show_year,
            media_table_show_type, media_table_show_size_on_disk, media_table_show_size_saved,
            media_table_show_genre, media_overview_poster_size, media_overview_detailed_progress_bar,
            media_overview_show_monitored, media_overview_show_network, media_overview_show_profile,
            media_overview_show_season_count, media_overview_show_path, media_overview_show_size_on_disk,
            queue_filter, queue_page_size, history_filter, history_page_size,
            events_filter, events_page_size, port, created_at, updated_at
        FROM settings LIMIT 1
    `).Scan(
		&settings.ID, &settings.Theme, &settings.DefaultProfile, &settings.QueueStatus, &settings.QueueStartupState,
		&settings.LogLevel, &settings.MediaView, &settings.MediaSort, &settings.MediaSortDirection, &settings.MediaFilter,
		&settings.MassEditorSort, &settings.MassEditorSortDirection, &settings.MassEditorFilter,
		&settings.MediaPosterSize, &settings.MediaPosterDetailedProgressBar,
		&settings.MediaPosterShowTitle, &settings.MediaPosterShowMonitored, &settings.MediaPosterShowProfile,
		&settings.MediaTableShowNetwork, &settings.MediaTableShowProfile, &settings.MediaTableShowSeasons,
		&settings.MediaTableShowEpisodes, &settings.MediaTableShowEpisodeCount, &settings.MediaTableShowYear,
		&settings.MediaTableShowType, &settings.MediaTableShowSizeOnDisk, &settings.MediaTableShowSizeSaved,
		&settings.MediaTableShowGenre, &settings.MediaOverviewPosterSize, &settings.MediaOverviewDetailedProgressBar,
		&settings.MediaOverviewShowMonitored, &settings.MediaOverviewShowNetwork, &settings.MediaOverviewShowProfile,
		&settings.MediaOverviewShowSeasonCount, &settings.MediaOverviewShowPath, &settings.MediaOverviewShowSizeOnDisk,
		&settings.QueueFilter, &settings.QueuePageSize, &settings.HistoryFilter, &settings.HistoryPageSize,
		&settings.EventsFilter, &settings.EventsPageSize, &settings.Port, &settings.CreatedAt, &settings.UpdatedAt,
	)

	if err == sql.ErrNoRows {
		return models.Settings{}, nil
	}
	return models.Settings{}, err
}

func (repo *SettingRepository) UpdateSettings(settings models.Settings) error {
	_, err := repo.DB.Exec(`
        UPDATE settings SET
            theme = ?, default_profile = ?, queue_status = ?, queue_startup_state = ?,
            log_level = ?, media_view = ?, media_sort = ?, media_sort_direction = ?, media_filter = ?,
            mass_editor_sort = ?, mass_editor_sort_direction = ?, mass_editor_filter = ?,
            media_poster_size = ?, media_poster_detailed_progress_bar = ?,
            media_poster_show_title = ?, media_poster_show_monitored = ?, media_poster_show_profile = ?,
            media_table_show_network = ?, media_table_show_profile = ?, media_table_show_seasons = ?,
            media_table_show_episodes = ?, media_table_show_episode_count = ?, media_table_show_year = ?,
            media_table_show_type = ?, media_table_show_size_on_disk = ?, media_table_show_size_saved = ?,
            media_table_show_genre = ?, media_overview_poster_size = ?, media_overview_detailed_progress_bar = ?,
            media_overview_show_monitored = ?, media_overview_show_network = ?, media_overview_show_profile = ?,
            media_overview_show_season_count = ?, media_overview_show_path = ?, media_overview_show_size_on_disk = ?,
            queue_filter = ?, queue_page_size = ?, history_filter = ?, history_page_size = ?,
            events_filter = ?, events_page_size = ?, port = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?`,
		settings.Theme, settings.DefaultProfile, settings.QueueStatus, settings.QueueStartupState,
		settings.LogLevel, settings.MediaView, settings.MediaSort, settings.MediaSortDirection, settings.MediaFilter,
		settings.MassEditorSort, settings.MassEditorSortDirection, settings.MassEditorFilter,
		settings.MediaPosterSize, settings.MediaPosterDetailedProgressBar,
		settings.MediaPosterShowTitle, settings.MediaPosterShowMonitored, settings.MediaPosterShowProfile,
		settings.MediaTableShowNetwork, settings.MediaTableShowProfile, settings.MediaTableShowSeasons,
		settings.MediaTableShowEpisodes, settings.MediaTableShowEpisodeCount, settings.MediaTableShowYear,
		settings.MediaTableShowType, settings.MediaTableShowSizeOnDisk, settings.MediaTableShowSizeSaved,
		settings.MediaTableShowGenre, settings.MediaOverviewPosterSize, settings.MediaOverviewDetailedProgressBar,
		settings.MediaOverviewShowMonitored, settings.MediaOverviewShowNetwork, settings.MediaOverviewShowProfile,
		settings.MediaOverviewShowSeasonCount, settings.MediaOverviewShowPath, settings.MediaOverviewShowSizeOnDisk,
		settings.QueueFilter, settings.QueuePageSize, settings.HistoryFilter, settings.HistoryPageSize,
		settings.EventsFilter, settings.EventsPageSize, settings.Port, settings.ID,
	)
	return err
}
