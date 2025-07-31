package types

import "transfigurr/internal/interfaces/services"

type Services struct {
	ScanService     services.ScanServiceI
	EncodeService   services.EncodeServiceI
	MetadataService services.MetadataServiceI
}
