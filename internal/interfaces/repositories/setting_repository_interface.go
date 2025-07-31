package repositories

import "transfigurr/internal/models"

type SettingRepositoryI interface {
	GetSettings() (models.Settings, error)
	UpdateSettings(setting models.Settings) error
}
