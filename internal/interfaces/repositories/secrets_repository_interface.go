package repositories

import "transfigurr/internal/models"

type SecretsRepositoryI interface {
	GetSecrets() (models.Secrets, error)
	UpdateSecrets(secrets models.Secrets) error
}
