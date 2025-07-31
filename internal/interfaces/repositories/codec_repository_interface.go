package repositories

import "transfigurr/internal/models"

type CodecRepositoryI interface {
	GetCodecs() map[string]models.Codec
	GetContainers() map[string]models.Container
	GetEncoders() map[string]models.Encoder
}
