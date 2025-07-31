package types

import interfaces "transfigurr/internal/interfaces/repositories"

type Repositories struct {
	SeriesRepo      interfaces.SeriesRepositoryInterface
	SeasonRepo      interfaces.SeasonRepositoryI
	EpisodeRepo     interfaces.EpisodeRepositoryI
	MovieRepo       interfaces.MovieRepositoryI
	SettingRepo     interfaces.SettingRepositoryI
	SystemStatsRepo interfaces.SystemStatsRepositoryI
	SecretsRepo     interfaces.SecretsRepositoryI
	ProfileRepo     interfaces.ProfileRepositoryI
	HistoryRepo     interfaces.HistoryRepositoryI
	EventRepo       interfaces.EventRepositoryI
	CodecRepo       interfaces.CodecRepositoryI
}
