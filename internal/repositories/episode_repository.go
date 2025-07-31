package repositories

import (
	"database/sql"
	"strconv"
	"transfigurr/internal/models"
)

type EpisodeRepository struct {
	DB *sql.DB
}

func NewEpisodeRepository(db *sql.DB) *EpisodeRepository {
	return &EpisodeRepository{
		DB: db,
	}
}

func (repo *EpisodeRepository) GetEpisodes(seriesId string, seasonNumber int) ([]models.Episode, error) {
	rows, err := repo.DB.Query(`
        SELECT e.id, e.series_id, e.season_id, 
        e.episode_number, e.season_name, e.season_number, 
        e.episode_name, e.air_date,
        f.id, f.filename, f.video_codec, f.size, f.space_saved,
        f.original_size, f.path, f.missing
        FROM episodes e
        LEFT JOIN files f ON e.file_id = f.id
        WHERE e.series_id = ? AND e.season_number = ?`,
		seriesId, seasonNumber,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var episodes []models.Episode
	for rows.Next() {
		var episode models.Episode
		var file models.File
		var fileId sql.NullString

		err := rows.Scan(
			&episode.Id, &episode.SeriesId, &episode.SeasonId,
			&episode.EpisodeNumber, &episode.SeasonName,
			&episode.SeasonNumber, &episode.EpisodeName,
			&episode.AirDate,
			&fileId, &file.Filename, &file.VideoCodec,
			&file.Size, &file.SpaceSaved, &file.OriginalSize,
			&file.Path, &file.Missing,
		)
		if err != nil {
			return nil, err
		}

		if fileId.Valid {
			file.Id = fileId.String
			episode.File = &file
		}
		episodes = append(episodes, episode)
	}
	return episodes, nil
}

func (repo *EpisodeRepository) UpsertEpisode(seriesId string, seasonNumber int, episodeNumber int, inputEpisode models.Episode) (models.Episode, error) {
	inputEpisode.Id = seriesId + strconv.Itoa(seasonNumber) + strconv.Itoa(episodeNumber)
	inputEpisode.SeriesId = seriesId
	fileId := inputEpisode.Id + "_file"

	tx, err := repo.DB.Begin()
	if err != nil {
		return models.Episode{}, err
	}
	defer tx.Rollback()

	if inputEpisode.File != nil {
		// Handle file information first
		inputEpisode.File.Id = fileId
		_, err = tx.Exec(`
            INSERT INTO files (id, filename, path, video_codec, 
            size, space_saved, original_size, missing)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
            filename = ?, path = ?, video_codec = ?,
            size = ?, space_saved = ?, original_size = ?,
            missing = ?`,
			fileId, inputEpisode.File.Filename, inputEpisode.File.Path,
			inputEpisode.File.VideoCodec, inputEpisode.File.Size,
			inputEpisode.File.SpaceSaved, inputEpisode.File.OriginalSize,
			inputEpisode.File.Missing,
			inputEpisode.File.Filename, inputEpisode.File.Path,
			inputEpisode.File.VideoCodec, inputEpisode.File.Size,
			inputEpisode.File.SpaceSaved, inputEpisode.File.OriginalSize,
			inputEpisode.File.Missing,
		)
		if err != nil {
			return models.Episode{}, err
		}
	}

	// Then handle episode information
	_, err = tx.Exec(`
        INSERT INTO episodes (
            id, file_id, series_id, season_id, episode_number,
            season_name, season_number, episode_name, air_date
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
        file_id = ?, series_id = ?, season_id = ?, episode_number = ?,
        season_name = ?, season_number = ?, episode_name = ?, air_date = ?`,
		inputEpisode.Id, fileId, inputEpisode.SeriesId,
		inputEpisode.SeasonId, inputEpisode.EpisodeNumber,
		inputEpisode.SeasonName, inputEpisode.SeasonNumber,
		inputEpisode.EpisodeName, inputEpisode.AirDate,
		fileId, inputEpisode.SeriesId,
		inputEpisode.SeasonId, inputEpisode.EpisodeNumber,
		inputEpisode.SeasonName, inputEpisode.SeasonNumber,
		inputEpisode.EpisodeName, inputEpisode.AirDate,
	)
	if err != nil {
		return models.Episode{}, err
	}

	if err = tx.Commit(); err != nil {
		return models.Episode{}, err
	}

	return repo.GetEpisodeById(inputEpisode.Id)
}

func (repo *EpisodeRepository) GetEpisodeById(episodeId string) (models.Episode, error) {
	var episode models.Episode
	var file models.File
	var fileId sql.NullString

	err := repo.DB.QueryRow(`
        SELECT e.id, e.series_id, e.season_id, 
        e.episode_number, e.season_name, e.season_number, 
        e.episode_name, e.air_date,
        f.id, f.filename, f.video_codec, f.size, f.space_saved,
        f.original_size, f.path, f.missing
        FROM episodes e
        LEFT JOIN files f ON e.file_id = f.id
        WHERE e.id = ?`,
		episodeId,
	).Scan(
		&episode.Id, &episode.SeriesId, &episode.SeasonId,
		&episode.EpisodeNumber, &episode.SeasonName,
		&episode.SeasonNumber, &episode.EpisodeName,
		&episode.AirDate,
		&fileId, &file.Filename, &file.VideoCodec,
		&file.Size, &file.SpaceSaved, &file.OriginalSize,
		&file.Path, &file.Missing,
	)
	if err != nil {
		return models.Episode{}, err
	}

	if fileId.Valid {
		file.Id = fileId.String
		episode.File = &file
	}
	return episode, nil
}

func (repo *EpisodeRepository) GetEpisodeBySeriesSeasonEpisode(seriesId string, seasonNumber int, episodeNumber int) (models.Episode, error) {
	var episode models.Episode
	var file models.File
	var fileId sql.NullString

	err := repo.DB.QueryRow(`
        SELECT e.id, e.series_id, e.season_id, e.episode_number,
        e.season_name, e.season_number, e.episode_name, e.air_date,
        f.id, f.filename, f.video_codec, f.size, f.space_saved,
        f.original_size, f.path, f.missing
        FROM episodes e
        LEFT JOIN files f ON e.file_id = f.id
        WHERE e.series_id = ? AND e.season_number = ? AND e.episode_number = ?`,
		seriesId, seasonNumber, episodeNumber,
	).Scan(
		&episode.Id, &episode.SeriesId, &episode.SeasonId,
		&episode.EpisodeNumber, &episode.SeasonName,
		&episode.SeasonNumber, &episode.EpisodeName,
		&episode.AirDate,
		&fileId, &file.Filename, &file.VideoCodec,
		&file.Size, &file.SpaceSaved, &file.OriginalSize,
		&file.Path, &file.Missing,
	)
	if err != nil {
		return models.Episode{}, err
	}

	if fileId.Valid {
		file.Id = fileId.String
		episode.File = &file
	}
	return episode, nil
}

func (repo *EpisodeRepository) DeleteEpisodeById(seriesId string, seasonNumber int, episodeNumber int) error {
	_, err := repo.DB.Exec(`
        DELETE FROM episodes 
        WHERE series_id = ? AND season_number = ? AND episode_number = ?`,
		seriesId, seasonNumber, episodeNumber,
	)
	return err
}
