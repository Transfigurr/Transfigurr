package services

import "transfigurr/internal/models"

type MetadataServiceI interface {
	Startup()
	Enqueue(item models.Item)
	EnqueueAll()
}
