package startup

import (
	"log"
	"os"
	"path/filepath"
	"time"
	"transfigurr/internal/interfaces/repositories"
)

func getParentDir() string {
	dir, err := os.Getwd()
	if err != nil {
		return ""
	}
	return filepath.Dir(dir)
}

func ensureDbPathExists(dbPath string) error {

	dir := filepath.Dir(dbPath)
	if _, err := os.Stat(dir); os.IsNotExist(err) {
		if err := os.MkdirAll(dir, os.ModePerm); err != nil {
			return err
		}
	}
	if _, err := os.Stat(dbPath); os.IsNotExist(err) {
		file, err := os.Create(dbPath)
		if err != nil {
			return err
		}
		file.Close()
	}
	return nil
}

func writeUptimeToDB(systemRepo repositories.SystemStatsRepositoryI) error {
	systems, err := systemRepo.GetSystemStats()
	if err != nil {
		log.Print(err)
	}
	systems.StartTime = time.Now()

	systemRepo.UpsertSystemStats(systems)
	return nil
}
