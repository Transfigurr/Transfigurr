package repositories

import (
	"database/sql"
	"log"
	"transfigurr/internal/models"
	"transfigurr/internal/utils"
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

	// Handle file information first if present
	if movie.File != nil {
		// Make sure movie.FileID is properly set
		if movie.FileID == "" {
			movie.FileID = id + "_file" // Use consistent naming convention
		}

		// Ensure the File.Id matches FileID
		movie.File.Id = movie.FileID

		// Generate hash for the file if it exists and is accessible
		if !movie.File.Missing {
			fileHash, err := utils.GenerateFileHash(movie.File.Path)
			if err != nil {
				log.Printf("Failed to generate hash for file %s: %v", movie.File.Path, err)
				return models.Movie{}, err
			}

			// Check if a file with this hash already exists
			var existingHash string
			err = tx.QueryRow("SELECT hash FROM files WHERE id = ?", movie.FileID).Scan(&existingHash)
			if err == nil && existingHash != fileHash {
				// Hash has changed, file has been modified
				movie.File.Hash = fileHash
			} else if err == sql.ErrNoRows {
				// New file
				movie.File.Hash = fileHash
			}
		}

		// Handle file information
		_, err = tx.Exec(`
			INSERT INTO files (id, filename, path, video_codec, 
			size, space_saved, original_size, missing, hash)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
			ON CONFLICT(id) DO UPDATE SET
			filename = ?, path = ?, video_codec = ?,
			size = ?, space_saved = ?, original_size = ?,
			missing = ?, hash = ?`,
			movie.FileID, movie.File.Filename, movie.File.Path, movie.File.VideoCodec,
			movie.File.Size, movie.File.SpaceSaved, movie.File.OriginalSize, movie.File.Missing, movie.File.Hash,
			movie.File.Filename, movie.File.Path, movie.File.VideoCodec,
			movie.File.Size, movie.File.SpaceSaved, movie.File.OriginalSize, movie.File.Missing, movie.File.Hash,
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
