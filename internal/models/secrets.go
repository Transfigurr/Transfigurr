package models

import "time"

type Secrets struct {
	ID        int64     `json:"id" db:"id"`
	Username  string    `json:"username" db:"username"`
	Password  string    `json:"password" db:"password"`
	Secret    string    `json:"secret" db:"secret"`
	TMDBKey   string    `json:"tmdb_key" db:"tmdb_key"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"`
}
