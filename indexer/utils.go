package main

import (
	"fmt"
	"log"
	"os"
	"path"
)

var rootDir string = getRootDir()

func formatBytes(b int64) string {
	const unit = 1000
	if b < unit {
		return fmt.Sprintf("%d Bytes", b)
	}
	div, exp := int64(unit), 0
	for n := b / unit; n >= unit; n /= unit {
		div *= unit
		exp++
	}
	return fmt.Sprintf("%.1f %ciB", float64(b)/float64(div), "kMGTPE"[exp])
}

func getRootDir() string {
	rootDir := "/data"
	if value, ok := os.LookupEnv("DATA_PATH"); ok {
		rootDir = value
	}

	if rootDir[0] != '/' {
		workDir, err := os.Getwd()
		if err != nil {
			log.Fatalln("Error has been occured during get working directory", err)
			return ""
		}

		rootDir = path.Join(workDir, rootDir)
	}

	return rootDir
}
