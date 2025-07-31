package repositories

import "transfigurr/internal/models"

type SystemStatsRepositoryI interface {
	GetSystemStats() (models.SystemStats, error)
	UpsertSystemStats(inputSystem models.SystemStats) (models.SystemStats, error)
}
