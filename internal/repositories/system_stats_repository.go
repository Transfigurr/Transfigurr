package repositories

import (
	"database/sql"
	"transfigurr/internal/models"
)

type SystemStatsRepository struct {
	DB *sql.DB
}

func NewSystemStatsRepository(db *sql.DB) *SystemStatsRepository {
	return &SystemStatsRepository{
		DB: db,
	}
}

func (repo *SystemStatsRepository) GetSystemStats() (models.SystemStats, error) {
	var stats models.SystemStats
	err := repo.DB.QueryRow(`
        SELECT id, start_time, series_count, episode_count, files_count, 
        size_on_disk, space_saved, monitored_count, unmonitored_count, 
        ended_count, continuing_count, series_total_space, series_free_space,
        movies_total_space, movies_free_space, config_total_space, 
        config_free_space, transcode_total_space, transcode_free_space,
        created_at, updated_at 
        FROM system_stats ORDER BY id DESC LIMIT 1
    `).Scan(
		&stats.Id, &stats.StartTime, &stats.SeriesCount, &stats.EpisodeCount,
		&stats.FilesCount, &stats.SizeOnDisk, &stats.SpaceSaved,
		&stats.MonitoredCount, &stats.UnmonitoredCount, &stats.EndedCount,
		&stats.ContinuingCount, &stats.SeriesTotalSpace, &stats.SeriesFreeSpace,
		&stats.MoviesTotalSpace, &stats.MoviesFreeSpace, &stats.ConfigTotalSpace,
		&stats.ConfigFreeSpace, &stats.TranscodeTotalSpace, &stats.TranscodeFreeSpace,
		&stats.CreatedAt, &stats.UpdatedAt,
	)
	if err != nil {
		return models.SystemStats{}, err
	}
	return stats, nil
}

func (repo *SystemStatsRepository) UpsertSystemStats(stats models.SystemStats) (models.SystemStats, error) {
	// Delete all existing rows first
	_, err := repo.DB.Exec(`DELETE FROM system_stats`)
	if err != nil {
		return models.SystemStats{}, err
	}

	// Insert the new row
	_, err = repo.DB.Exec(`
        INSERT INTO system_stats (
            start_time, series_count, episode_count, files_count, 
            size_on_disk, space_saved, monitored_count, unmonitored_count,
            ended_count, continuing_count, series_total_space, series_free_space,
            movies_total_space, movies_free_space, config_total_space,
            config_free_space, transcode_total_space, transcode_free_space
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		stats.StartTime, stats.SeriesCount, stats.EpisodeCount,
		stats.FilesCount, stats.SizeOnDisk, stats.SpaceSaved,
		stats.MonitoredCount, stats.UnmonitoredCount, stats.EndedCount,
		stats.ContinuingCount, stats.SeriesTotalSpace, stats.SeriesFreeSpace,
		stats.MoviesTotalSpace, stats.MoviesFreeSpace, stats.ConfigTotalSpace,
		stats.ConfigFreeSpace, stats.TranscodeTotalSpace, stats.TranscodeFreeSpace,
	)
	return stats, err
}
