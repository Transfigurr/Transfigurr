package models

// MediaInfo represents comprehensive information about a media file
type MediaInfo struct {
	// General file information
	Filename string  `json:"filename"`
	Path     string  `json:"path"`
	Format   string  `json:"format"`
	Duration float64 `json:"duration"`
	Size     int64   `json:"size"`
	Bitrate  int64   `json:"bitrate"`

	// Video stream information
	VideoCodec      string `json:"video_codec"`
	VideoWidth      int    `json:"video_width"`
	VideoHeight     int    `json:"video_height"`
	VideoFramerate  string `json:"video_framerate"`
	VideoAspect     string `json:"video_aspect"`
	VideoColorSpace string `json:"video_color_space"`
	VideoBitDepth   int    `json:"video_bit_depth"`
	VideoProfile    string `json:"video_profile"`
	VideoLevel      string `json:"video_level"`

	// Audio stream information
	AudioStreams []AudioStreamInfo `json:"audio_streams"`

	// Subtitle stream information
	SubtitleStreams []SubtitleStreamInfo `json:"subtitle_streams"`

	// Raw probe data for advanced use
	RawProbeData ProbeData `json:"raw_probe_data"`
}

// AudioStreamInfo contains details about an audio stream
type AudioStreamInfo struct {
	Index      int    `json:"index"`
	Codec      string `json:"codec"`
	Language   string `json:"language"`
	Channels   int    `json:"channels"`
	SampleRate int    `json:"sample_rate"`
	Bitrate    int    `json:"bitrate"`
	IsDefault  bool   `json:"is_default"`
	Title      string `json:"title"`
}

// SubtitleStreamInfo contains details about a subtitle stream
type SubtitleStreamInfo struct {
	Index     int    `json:"index"`
	Codec     string `json:"codec"`
	Language  string `json:"language"`
	IsDefault bool   `json:"is_default"`
	Title     string `json:"title"`
}
