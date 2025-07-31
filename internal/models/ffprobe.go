package models

type ProbeData struct {
	Format struct {
		Filename       string            `json:"filename"`
		NbStreams      int               `json:"nb_streams"`
		NbPrograms     int               `json:"nb_programs"`
		FormatName     string            `json:"format_name"`
		FormatLongName string            `json:"format_long_name"`
		StartTime      string            `json:"start_time"`
		Duration       string            `json:"duration"`
		Size           string            `json:"size"`
		BitRate        string            `json:"bit_rate"`
		ProbeScore     int               `json:"probe_score"`
		Tags           map[string]string `json:"tags"`
	} `json:"format"`
	Streams []struct {
		Index              int            `json:"index"`
		CodecName          string         `json:"codec_name"`
		CodecLongName      string         `json:"codec_long_name"`
		Profile            string         `json:"profile"`
		CodecType          string         `json:"codec_type"`
		CodecTimeBase      string         `json:"codec_time_base"`
		CodecTagString     string         `json:"codec_tag_string"`
		CodecTag           string         `json:"codec_tag"`
		Width              int            `json:"width,omitempty"`
		Height             int            `json:"height,omitempty"`
		CodedWidth         int            `json:"coded_width,omitempty"`
		CodedHeight        int            `json:"coded_height,omitempty"`
		HasBFrames         int            `json:"has_b_frames,omitempty"`
		SampleAspectRatio  string         `json:"sample_aspect_ratio,omitempty"`
		DisplayAspectRatio string         `json:"display_aspect_ratio,omitempty"`
		PixFmt             string         `json:"pix_fmt,omitempty"`
		Level              int            `json:"level,omitempty"`
		ColorRange         string         `json:"color_range,omitempty"`
		ColorSpace         string         `json:"color_space,omitempty"`
		ColorTransfer      string         `json:"color_transfer,omitempty"`
		ColorPrimaries     string         `json:"color_primaries,omitempty"`
		ChromaLocation     string         `json:"chroma_location,omitempty"`
		FieldOrder         string         `json:"field_order,omitempty"`
		Refs               int            `json:"refs,omitempty"`
		IsAvc              string         `json:"is_avc,omitempty"`
		NalLengthSize      string         `json:"nal_length_size,omitempty"`
		RFrameRate         string         `json:"r_frame_rate"`
		AvgFrameRate       string         `json:"avg_frame_rate"`
		TimeBase           string         `json:"time_base"`
		StartPts           int            `json:"start_pts"`
		StartTime          string         `json:"start_time"`
		DurationTs         int            `json:"duration_ts"`
		Duration           string         `json:"duration"`
		BitRate            string         `json:"bit_rate,omitempty"`
		MaxBitRate         string         `json:"max_bit_rate,omitempty"`
		BitsPerRawSample   string         `json:"bits_per_raw_sample,omitempty"`
		NbFrames           string         `json:"nb_frames"`
		Disposition        map[string]int `json:"disposition"`

		// Audio-specific fields
		SampleFmt       string `json:"sample_fmt,omitempty"`
		SampleRate      string `json:"sample_rate,omitempty"`
		Channels        int    `json:"channels,omitempty"`
		ChannelLayout   string `json:"channel_layout,omitempty"`
		BitsPerSample   int    `json:"bits_per_sample,omitempty"`
		DmixMode        string `json:"dmix_mode,omitempty"`
		LtrtCmixLevel   string `json:"ltrt_cmixlev,omitempty"`
		LtrtSurroundMix string `json:"ltrt_surmixlev,omitempty"`
		LoroSurroundMix string `json:"loro_surmixlev,omitempty"`
		LoroCmixLevel   string `json:"loro_cmixlev,omitempty"`

		// Video-specific additional fields
		FilmGrain    int                      `json:"film_grain,omitempty"`
		Rotation     string                   `json:"rotation,omitempty"`
		SideDataList []map[string]interface{} `json:"side_data_list,omitempty"`

		Tags struct {
			Language             string `json:"language,omitempty"`
			BPS                  string `json:"BPS,omitempty"`
			NumberOfFrames       string `json:"NUMBER_OF_FRAMES,omitempty"`
			NumberOfBytes        string `json:"NUMBER_OF_BYTES,omitempty"`
			StatisticsWritingApp string `json:"_STATISTICS_WRITING_APP,omitempty"`
			StatisticsTags       string `json:"_STATISTICS_TAGS,omitempty"`
			Encoder              string `json:"ENCODER,omitempty"`
			Duration             string `json:"DURATION,omitempty"`
			Title                string `json:"title,omitempty"`
			Handler              string `json:"handler_name,omitempty"`
			Creation_time        string `json:"creation_time,omitempty"`
		} `json:"tags"`
	} `json:"streams"`

	// Chapter information
	Chapters []struct {
		ID        int               `json:"id"`
		TimeBase  string            `json:"time_base"`
		Start     int64             `json:"start"`
		StartTime string            `json:"start_time"`
		End       int64             `json:"end"`
		EndTime   string            `json:"end_time"`
		Tags      map[string]string `json:"tags"`
	} `json:"chapters,omitempty"`

	// Program information
	Programs []struct {
		ProgramID  int               `json:"program_id"`
		ProgramNum int               `json:"program_num"`
		NbStreams  int               `json:"nb_streams"`
		StreamIds  []int             `json:"stream_ids,omitempty"`
		Tags       map[string]string `json:"tags,omitempty"`
	} `json:"programs,omitempty"`

	// Error information if present
	Error struct {
		Code   int    `json:"code,omitempty"`
		String string `json:"string,omitempty"`
	} `json:"error,omitempty"`
}
