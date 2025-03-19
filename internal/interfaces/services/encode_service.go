package services

import "transfigurr/internal/models"

type EncodeServiceI interface {
	Enqueue(item models.Item)
	Startup()
	GetQueue() models.QueueStatus
}
