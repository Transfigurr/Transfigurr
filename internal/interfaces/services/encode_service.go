<<<<<<<< HEAD:internal/interfaces/services/encode_service_interface.go
package services

import "transfigurr/internal/models"

type EncodeServiceI interface {
	Enqueue(item models.Item)
	Startup()
	GetQueue() models.QueueStatus
}
========
package services

import "transfigurr/internal/models"

type EncodeServiceI interface {
	Enqueue(item models.Item)
	Startup()
	GetQueue() models.QueueStatus
}
>>>>>>>> origin/16-rewrite-backend-in-go:internal/interfaces/services/encode_service.go
