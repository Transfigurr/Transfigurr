package repositories

import (
	"database/sql"
	"log"
	"time"

	"transfigurr/internal/models"
)

type SecretsRepository struct {
	db *sql.DB
}

func NewSecretsRepository(db *sql.DB) *SecretsRepository {
	return &SecretsRepository{
		db: db,
	}
}

func (r *SecretsRepository) GetSecrets() (models.Secrets, error) {
	secrets := models.Secrets{}
	err := r.db.QueryRow(`
        SELECT id, username, password, secret, tmdb_key, created_at, updated_at 
        FROM secrets 
        ORDER BY id ASC 
        LIMIT 1
    `).Scan(
		&secrets.ID,
		&secrets.Username,
		&secrets.Password,
		&secrets.Secret,
		&secrets.TMDBKey,
		&secrets.CreatedAt,
		&secrets.UpdatedAt,
	)
	if err != nil {
		log.Print("Error retrieving secrets:", err)
		return models.Secrets{}, err
	}
	return secrets, nil
}

func (r *SecretsRepository) UpdateSecrets(secrets models.Secrets) error {
	secrets.UpdatedAt = time.Now()

	_, err := r.db.Exec(`
        UPDATE secrets 
        SET username = ?, password = ?, secret = ?, tmdb_key = ?, updated_at = ?
        WHERE id = ?`,
		secrets.Username,
		secrets.Password,
		secrets.Secret,
		secrets.TMDBKey,
		secrets.UpdatedAt,
		secrets.ID,
	)
	return err
}
