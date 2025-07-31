package controllers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"transfigurr/internal/interfaces/repositories"
	"transfigurr/internal/models"
)

type SystemStatsController struct {
	Repo repositories.SystemStatsRepositoryI
}

func NewSystemStatsController(repo repositories.SystemStatsRepositoryI) *SystemStatsController {
	return &SystemStatsController{
		Repo: repo,
	}
}

func (ctrl *SystemStatsController) GetSystemStats(w http.ResponseWriter, r *http.Request) {
	systemStats, err := ctrl.Repo.GetSystemStats()
	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "No systemStats found", http.StatusNotFound)
		} else {
			http.Error(w, "Error retrieving systemStatss", http.StatusInternalServerError)
		}
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(systemStats)
}

func (ctrl *SystemStatsController) UpsertSystemStats(w http.ResponseWriter, r *http.Request) {
	var inputSystemStats models.SystemStats
	if err := json.NewDecoder(r.Body).Decode(&inputSystemStats); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	systemStats, err := ctrl.Repo.UpsertSystemStats(inputSystemStats)
	if err != nil {
		http.Error(w, "Error upserting systemStats", http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(systemStats)
}
