package services

import "transfigurr/internal/models"

type ScanServiceI interface {
	Startup()
	Enqueue(item models.Item)
	EnqueueAll()
	EnqueueAllSeries()
	EnqueueAllMovies()
}
