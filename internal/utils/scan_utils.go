package utils

import (
	"log"
	"os"
	"path/filepath"
	"regexp"
	"strconv"
	"syscall"
	"transfigurr/internal/config"
	"transfigurr/internal/interfaces/repositories"
	"transfigurr/internal/interfaces/services"
	"transfigurr/internal/models"
)

var (
	seasonPattern  = regexp.MustCompile(`\d+`)
	episodePattern = regexp.MustCompile(`(?:S(\d{2})E(\d{2})|E(\d{2}))`)
)

func parseEpisodeAndSeasonNumber(file string, folder string) (int, int) {
	match := episodePattern.FindStringSubmatch(file)
	if match == nil {
		return 0, 0
	}
	if match[1] != "" {
		season, _ := strconv.Atoi(match[1])
		episode, _ := strconv.Atoi(match[2])
		return season, episode
	} else {
		parent := filepath.Base(folder)
		seasonNumber := seasonPattern.FindStringSubmatch(parent)
		if parent == "specials" {
			episode, _ := strconv.Atoi(match[3])
			return 0, episode
		}
		if seasonNumber != nil {
			season, _ := strconv.Atoi(seasonNumber[0])
			episode, _ := strconv.Atoi(match[3])
			return season, episode
		} else {
			episode, _ := strconv.Atoi(match[3])
			return 0, episode
		}
	}
}

func ScanMovie(movieID string, movieRepo repositories.MovieRepositoryI, settingRepo repositories.SettingRepositoryI, profileRepo repositories.ProfileRepositoryI) {
	if movieID == "" {
		return
	}

	moviesPath := filepath.Join(config.MoviesPath, movieID)
	if _, err := os.Stat(moviesPath); os.IsNotExist(err) {
		return
	}

	movie, err := movieRepo.GetMovieById(movieID)
	if err != nil {
		log.Print(err)
	}

	// Initialize a new movie if it doesn't exist
	if movie.Id == "" {
		movie = models.Movie{
			Id: movieID,
		}
	}

	settings, err := settingRepo.GetSettings()
	if err != nil {
		log.Print("settingsErr", err)
	}

	if movie.ProfileID == 0 {
		movie.ProfileID = settings.DefaultProfile
	}

	// Start with no file
	movie.File = nil
	movie.FileID = ""

	fileFound := false

	file, fileFound := FindMediaFile(moviesPath, movieID)

	if fileFound && file != nil {
		movie.File = file
		movie.FileID = file.Id
	}

	_, err = movieRepo.UpsertMovie(movie.Id, movie)
	if err != nil {
		log.Print("upsert err", err)
	}
}

func ScanSeries(encodeService services.EncodeServiceI, seriesID string, seriesRepo repositories.SeriesRepositoryInterface, seasonRepo repositories.SeasonRepositoryI, episodeRepo repositories.EpisodeRepositoryI, settingRepo repositories.SettingRepositoryI, profileRepo repositories.ProfileRepositoryI) {
	defer func() {
		if r := recover(); r != nil {
		}
	}()

	series, _ := seriesRepo.GetSeriesByID(seriesID)

	series.MissingEpisodes = 0
	if series.Id == "" {
		series.Id = seriesID
	}
	seriesPath := filepath.Join(config.SeriesPath, seriesID)

	if _, err := os.Stat(seriesPath); os.IsNotExist(err) {
		log.Print(err)
		return
	}

	settings, settingsErr := settingRepo.GetSettings()
	if settingsErr != nil {
		log.Print("settingsErr", settingsErr)
	}
	if series.ProfileID == 0 {
		series.ProfileID = settings.DefaultProfile
	}
	profile, profileErr := profileRepo.GetProfileById(series.ProfileID)
	if profileErr != nil {
		log.Print(profileErr)
		return
	}
	seasons := make(map[string]*models.Season)

	err := filepath.Walk(seriesPath, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			log.Print(err)
			return err
		}
		if info.IsDir() {
			return nil
		}

		seasonNumber, episodeNumber := parseEpisodeAndSeasonNumber(info.Name(), filepath.Dir(path))
		seasonID := seriesID + strconv.Itoa(seasonNumber)

		episode, err := episodeRepo.GetEpisodeBySeriesSeasonEpisode(seriesID, seasonNumber, episodeNumber)
		if err != nil {
			// If episode doesn't exist, create new one with basic info
			episode = models.Episode{}
		}

		episode.Id = seriesID + strconv.Itoa(seasonNumber) + strconv.Itoa(episodeNumber)
		episode.EpisodeNumber = episodeNumber
		episode.SeasonNumber = seasonNumber
		episode.SeasonId = seasonID
		episode.Path = path

		if episode.OriginalSize == 0 {
			episode.OriginalSize = episode.Size
		}

		vcodec, err := AnalyzeMediaFile(path)
		if err != nil {
			log.Print(err)
			return nil
		}
		episode.VideoCodec = vcodec

		if _, ok := seasons[seasonID]; !ok {
			seasons[seasonID] = &models.Season{
				SeasonNumber: seasonNumber,
				Name:         episode.SeasonName,
				EpisodeCount: 1,
				Size:         episode.Size,
			}
		} else {
			seasons[seasonID].EpisodeCount++
			seasons[seasonID].Size += episode.Size
			seasons[seasonID].SpaceSaved += episode.Size
			seasons[seasonID].Name = filepath.Base(filepath.Dir(path))
		}

		if episode.VideoCodec != profile.Codec && profile.Codec != "Any" {
			episode.Missing = true
			series.MissingEpisodes += 1
			if _, ok := seasons[seasonID]; ok {
				seasons[seasonID].MissingEpisodes += 1
			}
		}
		if episode.Missing && series.Monitored {
			log.Print("Enqueueing episode: " + episode.Id)
			encodeService.Enqueue(models.Item{Type: "episode", Id: episode.Id, ProfileId: series.ProfileID, SeriesId: seriesID, SeasonNumber: seasonNumber, EpisodeNumber: episodeNumber, Name: series.Id, Size: episode.Size, Codec: episode.VideoCodec})
		}
		episodeRepo.UpsertEpisode(seriesID, seasonNumber, episodeNumber, episode)

		return nil
	})
	if err != nil {
		log.Print(err)
		return
	}

	// Update series properties before saving
	series.SeasonsCount = len(seasons)
	series.EpisodeCount = 0
	series.Size = 0
	series.SpaceSaved = 0

	for _, season := range seasons {
		seasonRepo.UpsertSeason(seriesID, season.SeasonNumber, *season)
		series.EpisodeCount += season.EpisodeCount
		series.Size += season.Size
		series.SpaceSaved += season.SpaceSaved
	}
	seriesRepo.UpsertSeries(series.Id, series)
}

func getDiskSpace(path string) (uint64, uint64, error) {
	var stat syscall.Statfs_t
	err := syscall.Statfs(path, &stat)
	if err != nil {
		return 0, 0, err
	}
	free := stat.Bavail * uint64(stat.Bsize)
	total := stat.Blocks * uint64(stat.Bsize)
	return free, total, nil
}

func ScanSystem(seriesRepo repositories.SeriesRepositoryInterface, systemStatsRepo repositories.SystemStatsRepositoryI) {

	series, err := seriesRepo.GetSeries()
	if err != nil {
		return
	}

	seriesCount := 0
	episodeCount := 0
	fileCount := 0
	sizeOnDisk := 0
	monitoredCount := 0
	unmonitoredCount := 0
	endedCount := 0
	continuingCount := 0
	spaceSaved := 0

	seriesFreeSpace, seriesTotalSpace, err := getDiskSpace(config.SeriesPath)
	if err != nil {
		log.Print(err)
		return
	}

	moviesFreeSpace, moviesTotalSpace, err := getDiskSpace(config.MoviesPath)
	if err != nil {
		log.Print(err)
		return
	}
	configFreeSpace, configTotalSpace, err := getDiskSpace(config.ConfigPath)
	if err != nil {
		log.Print(err)
		return
	}
	transcodeFreeSpace, transcodeTotalSpace, err := getDiskSpace(config.TranscodeFolder)

	if err != nil {
		log.Print(err)
		return
	}

	for id := range series {
		s := series[id]
		seriesCount++
		sizeOnDisk += s.Size
		spaceSaved += s.SpaceSaved
		episodeCount += s.EpisodeCount
		fileCount += s.EpisodeCount
		if s.Monitored {
			monitoredCount++
		} else {
			unmonitoredCount++
		}
		if s.Status == "Ended" {
			endedCount++
		} else {
			continuingCount++
		}
	}

	systemStats, err := systemStatsRepo.GetSystemStats()
	if err != nil {
		log.Print(err)
		return
	}
	systemStats.SeriesCount = seriesCount
	systemStats.EpisodeCount = episodeCount
	systemStats.FilesCount = fileCount
	systemStats.SizeOnDisk = int64(sizeOnDisk)
	systemStats.SpaceSaved = int64(spaceSaved)
	systemStats.MonitoredCount = monitoredCount
	systemStats.UnmonitoredCount = unmonitoredCount
	systemStats.EndedCount = endedCount
	systemStats.ContinuingCount = continuingCount
	systemStats.SeriesTotalSpace = int64(seriesTotalSpace)
	systemStats.SeriesFreeSpace = int64(seriesFreeSpace)
	systemStats.MoviesTotalSpace = int64(moviesTotalSpace)
	systemStats.MoviesFreeSpace = int64(moviesFreeSpace)
	systemStats.ConfigTotalSpace = int64(configTotalSpace)
	systemStats.ConfigFreeSpace = int64(configFreeSpace)
	systemStats.TranscodeTotalSpace = int64(transcodeTotalSpace)
	systemStats.TranscodeFreeSpace = int64(transcodeFreeSpace)
	_, err = systemStatsRepo.UpsertSystemStats(systemStats)
	if err != nil {
		log.Print(err)
		return
	}
}

func CreateFile(mediaId string, path string, info os.FileInfo) *models.File {
	var file *models.File

	// Only create File object when we find a valid file
	file = &models.File{
		Id:       mediaId,
		Filename: info.Name(),
		Path:     path,
		Size:     int(info.Size()),
	}

	// Get codec information
	vcodec, err := AnalyzeMediaFile(path)
	if err != nil {
		log.Print("codec analysis error:", err)
		return file // Continue to next file
	}
	file.VideoCodec = vcodec

	return file
}

func FindMediaFile(directoryPath string, mediaId string) (*models.File, bool) {
	var file *models.File
	fileFound := false

	err := filepath.Walk(directoryPath, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			log.Print("filepath walk error:", err)
			return err
		}

		if info.IsDir() {
			return nil // Skip directories
		}

		// Only create File object when we find a valid file
		if !fileFound {
			file = &models.File{
				Id:       mediaId,
				Filename: info.Name(),
				Path:     path,
				Size:     int(info.Size()),
			}
			fileFound = true

			// Get codec information
			vcodec, err := AnalyzeMediaFile(path)
			if err != nil {
				log.Print("codec analysis error:", err)
				return nil // Continue to next file
			}
			file.VideoCodec = vcodec

			// Set original size if not already set
			if file.OriginalSize == 0 {
				file.OriginalSize = file.Size
			}
			return filepath.SkipAll
		}
		return nil
	})

	if err != nil {
		log.Print("error scanning directory:", err)
	}

	return file, fileFound
}
