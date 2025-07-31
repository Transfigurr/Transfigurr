package utils

import (
	"bufio"
	"encoding/hex"
	"fmt"
	"io"
	"os"

	"github.com/cespare/xxhash/v2"
)

const (
	// Size of each chunk to read when hashing large files
	chunkSize = 64 * 1024 // 64KB chunks
)

// GenerateFileHash generates a fast xxHash of a file's contents
// Returns the hash as a hex string and any error encountered
func GenerateFileHash(filePath string) (string, error) {
	file, err := os.Open(filePath)
	if err != nil {
		return "", fmt.Errorf("failed to open file for hashing: %w", err)
	}
	defer file.Close()

	// Create a buffered reader for efficient reading
	reader := bufio.NewReaderSize(file, chunkSize)
	
	// Initialize xxHash hasher
	hasher := xxhash.New()

	// Read and hash the file in chunks
	buf := make([]byte, chunkSize)
	for {
		n, err := reader.Read(buf)
		if err != nil {
			if err == io.EOF {
				break
			}
			return "", fmt.Errorf("error reading file for hashing: %w", err)
		}
		
		hasher.Write(buf[:n])
	}

	// Get the hash as bytes and convert to hex string
	hashBytes := hasher.Sum(nil)
	hashString := hex.EncodeToString(hashBytes)

	return hashString, nil
}

// CompareFileHash compares a file's current hash with a stored hash
// Returns true if they match, false otherwise
func CompareFileHash(filePath string, storedHash string) (bool, error) {
	currentHash, err := GenerateFileHash(filePath)
	if err != nil {
		return false, err
	}
	
	return currentHash == storedHash, nil
} 