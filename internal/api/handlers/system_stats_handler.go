package handlers

import (
	"net/http"
	"strings"
	"transfigurr/internal/api/controllers"
	"transfigurr/internal/interfaces/repositories"
)

func HandleSystem(systemRepo repositories.SystemStatsRepositoryI) http.HandlerFunc {
	controller := controllers.NewSystemStatsController(systemRepo)

	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")

		path := strings.TrimPrefix(r.URL.Path, "/api/system_stats/")
		segments := strings.Split(strings.Trim(path, "/"), "/")

		switch {
		case r.Method == http.MethodGet && len(segments) == 1 && segments[0] == "":
			controller.GetSystemStats(w, r)
		case r.Method == http.MethodGet && len(segments) == 1:
			controller.UpsertSystemStats(w, r)
		default:
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	}
}
