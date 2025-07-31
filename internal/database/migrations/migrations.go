package migrations

import (
	"embed"
	"fmt"
	"strings"
)

//go:embed sql/*.sql
var sqlFiles embed.FS

func LoadMigration(filename string) (string, error) {

	data, err := sqlFiles.ReadFile(fmt.Sprintf("sql/%s", filename))
	if err != nil {
		return "", fmt.Errorf("failed to read migration file %s: %w", filename, err)
	}
	return strings.TrimSpace(string(data)), nil
}
