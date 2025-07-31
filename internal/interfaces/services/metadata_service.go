<<<<<<<< HEAD:internal/interfaces/services/metadata_service_interface.go
package services

import "transfigurr/internal/models"

type MetadataServiceI interface {
	Startup()
	Enqueue(item models.Item)
	EnqueueAll()
}
========
package services

import "transfigurr/internal/models"

type MetadataServiceI interface {
	Startup()
	Enqueue(item models.Item)
	EnqueueAll()
}
>>>>>>>> origin/16-rewrite-backend-in-go:internal/interfaces/services/metadata_service.go
