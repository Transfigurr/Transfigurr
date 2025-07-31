package models

type File struct {
	Id           string `json:"id"`
	Filename     string `json:"filename"`
	Path         string `json:"path"`
	VideoCodec   string `json:"videoCodec"`
	Size         int    `json:"size"`
	SpaceSaved   int    `json:"spaceSaved"`
	OriginalSize int    `json:"originalSize"`
	Missing      bool   `json:"missing"`
	Hash         string `json:"hash"`
	// add hash
}
