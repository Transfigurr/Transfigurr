package repositories

import (
	"database/sql"
	"transfigurr/internal/types"
)

func NewRepositories(db *sql.DB) *types.Repositories {
	return &types.Repositories{
		SeriesRepo:      NewSeriesRepository(db),
		SeasonRepo:      NewSeasonRepository(db),
		EpisodeRepo:     NewEpisodeRepository(db),
		MovieRepo:       NewMovieRepository(db),
		SettingRepo:     NewSettingRepository(db),
		SystemStatsRepo: NewSystemStatsRepository(db),
		SecretsRepo:     NewSecretsRepository(db),
		ProfileRepo:     NewProfileRepository(db),
		HistoryRepo:     NewHistoryRepository(db),
		EventRepo:       NewEventRepository(db),
		CodecRepo:       NewCodecRepository(),
	}
}
