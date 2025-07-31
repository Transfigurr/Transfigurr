package controllers

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"transfigurr/internal/interfaces/repositories"
	"transfigurr/internal/models"
)

type SettingController struct {
	Repo repositories.SettingRepositoryI
}

func NewSettingController(repo repositories.SettingRepositoryI) *SettingController {
	return &SettingController{
		Repo: repo,
	}
}

// GetSettings retrieves the application settings
func (ctrl *SettingController) GetSettings(w http.ResponseWriter, r *http.Request) {
	settings, err := ctrl.Repo.GetSettings()
	if err != nil {
		log.Print("settingsErr", err)
		if err == sql.ErrNoRows {
			http.Error(w, "Settings not found", http.StatusNotFound)
		} else {
			http.Error(w, "Error retrieving settings", http.StatusInternalServerError)
		}
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(settings)
}

// UpdateSettings updates the application settings
func (ctrl *SettingController) UpdateSettings(w http.ResponseWriter, r *http.Request) {
	var settings models.Settings
	if err := json.NewDecoder(r.Body).Decode(&settings); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	err := ctrl.Repo.UpdateSettings(settings)
	if err != nil {
		http.Error(w, "Error updating settings", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(settings)
}
