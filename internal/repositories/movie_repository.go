package repositories

import (
	"database/sql"
	"log"
	"transfigurr/internal/models"
)

type MovieRepository struct {
	DB *sql.DB
}

func NewMovieRepository(db *sql.DB) *MovieRepository {
	return &MovieRepository{DB: db}
}

func (repo *MovieRepository) GetMovies() ([]models.Movie, error) {
	rows, err := repo.DB.Query(`
        SELECT m.id, m.name, m.release_date, m.genre, 
        m.status, m.overview, m.profile_id, m.monitored, 
        m.studio, m.runtime, m.file_id,
        f.filename, f.video_codec, f.size, f.space_saved,
        f.original_size, f.path, f.missing
        FROM movies m
        LEFT JOIN files f ON m.file_id = f.id
    `)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var movies []models.Movie
	for rows.Next() {
		var movie models.Movie
		var filename, videoCodec, path sql.NullString
		var size, spaceSaved, originalSize sql.NullInt64
		var missing sql.NullBool

		err := rows.Scan(
			&movie.Id, &movie.Name, &movie.ReleaseDate,
			&movie.Genre, &movie.Status, &movie.Overview,
			&movie.ProfileID, &movie.Monitored, &movie.Studio,
			&movie.Runtime, &movie.FileID,
			&filename, &videoCodec, &size, &spaceSaved,
			&originalSize, &path, &missing,
		)
		if err != nil {
			return nil, err
		}

		if movie.FileID != "" {
			movie.File = &models.File{
				Id:           movie.FileID,
				Filename:     filename.String,
				VideoCodec:   videoCodec.String,
				Size:         int(size.Int64),
				SpaceSaved:   int(spaceSaved.Int64),
				OriginalSize: int(originalSize.Int64),
				Path:         path.String,
				Missing:      missing.Bool,
			}
		}
		movies = append(movies, movie)
	}
	return movies, nil
}

func (repo *MovieRepository) GetMovieById(id string) (models.Movie, error) {
	var movie models.Movie
	var filename, videoCodec, path sql.NullString
	var size, spaceSaved, originalSize sql.NullInt64
	var missing sql.NullBool

	err := repo.DB.QueryRow(`
        SELECT m.id, m.name, m.release_date, m.genre, 
        m.status, m.overview, m.profile_id, m.monitored, 
        m.studio, m.runtime, m.file_id,
        f.filename, f.video_codec, f.size, f.space_saved,
        f.original_size, f.path, f.missing
        FROM movies m
        LEFT JOIN files f ON m.file_id = f.id
        WHERE m.id = ?`, id,
	).Scan(
		&movie.Id, &movie.Name, &movie.ReleaseDate,
		&movie.Genre, &movie.Status, &movie.Overview,
		&movie.ProfileID, &movie.Monitored, &movie.Studio,
		&movie.Runtime, &movie.FileID,
		&filename, &videoCodec, &size, &spaceSaved,
		&originalSize, &path, &missing,
	)
	if err != nil {
		return models.Movie{}, err
	}

	if movie.FileID != "" {
		movie.File = &models.File{
			Id:           movie.FileID,
			Filename:     filename.String,
			VideoCodec:   videoCodec.String,
			Size:         int(size.Int64),
			SpaceSaved:   int(spaceSaved.Int64),
			OriginalSize: int(originalSize.Int64),
			Path:         path.String,
			Missing:      missing.Bool,
		}
	}
	return movie, nil
}
func (repo *MovieRepository) UpsertMovie(id string, movie models.Movie) (models.Movie, error) {
	tx, err := repo.DB.Begin()
	if err != nil {
		return models.Movie{}, err
	}
	defer tx.Rollback()

	// Ensure consistent file ID
	log.Print("IS FILE", movie.File)
	if movie.File != nil {
		// Make sure movie.FileID is properly set
		if movie.FileID == "" {
			movie.FileID = id + "_file" // Use consistent naming convention
		}

		// Ensure the File.Id matches FileID
		log.Print("Filing", movie.FileID, movie.File.Id)
		movie.File.Id = movie.FileID

		// Handle file information first
		_, err = tx.Exec(`
            INSERT INTO files (id, filename, path, video_codec, 
            size, space_saved, original_size, missing)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
            filename = ?, path = ?, video_codec = ?,
            size = ?, space_saved = ?, original_size = ?,
            missing = ?`,
			movie.FileID, movie.File.Filename, movie.File.Path, movie.File.VideoCodec,
			movie.File.Size, movie.File.SpaceSaved, movie.File.OriginalSize, movie.File.Missing,
			movie.File.Filename, movie.File.Path, movie.File.VideoCodec,
			movie.File.Size, movie.File.SpaceSaved, movie.File.OriginalSize, movie.File.Missing,
		)
		if err != nil {
			log.Print("file trans err", err)
			return models.Movie{}, err
		}
	}

	// Rest of the method remains unchanged
	_, err = tx.Exec(`
        INSERT INTO movies (
            id, file_id, name, release_date, genre,
            status, overview, profile_id, monitored,
            studio, runtime
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
        file_id = ?, name = ?, release_date = ?, genre = ?,
        status = ?, overview = ?, profile_id = ?, monitored = ?,
        studio = ?, runtime = ?`,
		id, movie.FileID, movie.Name, movie.ReleaseDate, movie.Genre,
		movie.Status, movie.Overview, movie.ProfileID, movie.Monitored,
		movie.Studio, movie.Runtime,
		movie.FileID, movie.Name, movie.ReleaseDate, movie.Genre,
		movie.Status, movie.Overview, movie.ProfileID, movie.Monitored,
		movie.Studio, movie.Runtime,
	)
	if err != nil {
		return models.Movie{}, err
	}

	if err = tx.Commit(); err != nil {
		return models.Movie{}, err
	}

	return repo.GetMovieById(id)
}

func (repo *MovieRepository) DeleteMovieById(id string) error {
	tx, err := repo.DB.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	// Delete associated file first due to foreign key constraint
	_, err = tx.Exec(`DELETE FROM files WHERE id = ?`, id+"_file")
	if err != nil {
		return err
	}

	// Then delete the movie
	_, err = tx.Exec(`DELETE FROM movies WHERE id = ?`, id)
	if err != nil {
		return err
	}

	return tx.Commit()
}
