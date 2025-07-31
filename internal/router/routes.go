package router

import (
	"log"
	"net/http"
	"transfigurr/internal/api/handlers"
	"transfigurr/internal/router/middleware"
	"transfigurr/internal/types"
)

func Chain(handler http.Handler, middlewares ...func(http.Handler) http.Handler) http.Handler {
	for _, middleware := range middlewares {
		handler = middleware(handler)
	}
	return handler
}

func SetupRouter(mux *http.ServeMux, services *types.Services, repositories *types.Repositories) {
	secrets, err := repositories.SecretsRepo.GetSecrets()
	log.Print(secrets, err, "secrets")
	if err != nil {
		log.Panic("Failed to get secret")
	}
	jwtSecret := []byte(secrets.Secret)

	// Public Routes with higher rate limits
	publicRateLimit := middleware.RateLimit(middleware.PublicConfig)

	authHandler := Chain(
		http.HandlerFunc(handlers.HandleAuth(repositories.SecretsRepo)),
		publicRateLimit,
	)
	mux.Handle("/api/auth/", authHandler)

	// Static file serving with public rate limits
	assetsHandler, rootHandler := handlers.HandleStatic("./frontend/dist")
	mux.Handle("/assets/", publicRateLimit(http.HandlerFunc(assetsHandler)))
	mux.Handle("/", publicRateLimit(http.HandlerFunc(rootHandler)))

	// Protected Routes with stricter rate limits
	protectedRateLimit := middleware.RateLimit(middleware.DefaultConfig)

	// Helper function to apply both auth and rate limiting
	protected := func(handler http.HandlerFunc) http.Handler {
		return Chain(
			handler,
			protectedRateLimit,
			func(h http.Handler) http.Handler {
				return middleware.AuthMiddleware(h.ServeHTTP, jwtSecret)
			},
		)
	}

	// Protected routes
	mux.Handle("/api/series/", protected(handlers.HandleSeries(repositories.SeriesRepo, repositories.SeasonRepo, repositories.EpisodeRepo, services.ScanService)))
	mux.Handle("/api/movies/", protected(handlers.HandleMovies(services.ScanService, repositories.MovieRepo)))
	mux.Handle("/api/settings/", protected(handlers.HandleSettings(repositories.SettingRepo)))
	mux.Handle("/api/system_stats/", protected(handlers.HandleSystem(repositories.SystemStatsRepo)))
	mux.Handle("/api/profiles/", protected(handlers.HandleProfiles(services.ScanService, repositories.ProfileRepo, repositories.MovieRepo, repositories.SeriesRepo)))
	mux.Handle("/api/history/", protected(handlers.HandleHistory(repositories.HistoryRepo)))
	mux.Handle("/api/events/", protected(handlers.HandleEvents(repositories.EventRepo)))
	mux.Handle("/api/codecs/", protected(handlers.HandleCodecs(repositories.CodecRepo)))
	mux.Handle("/api/actions/", protected(handlers.HandleActions(services.ScanService, services.MetadataService)))
	mux.Handle("/api/artwork/", protected(handlers.HandleArtwork()))
	mux.Handle("/api/events/stream", protected(handlers.HandleEventStream(services.EncodeService, repositories)))
}
