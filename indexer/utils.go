package main

import (
	"fmt"
	"log"
	"os"
	"path"
	"path/filepath"
	"strings"
	"time"
)

func getEnv(key, _default string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}

	return _default
}

func ptr[T any](v T) *T {
	return &v
}

func getAllTarget() []string {
	target := []string{}
	rootPath := "/data/static"

	err := filepath.Walk(rootPath, func(physicalPath string, info os.FileInfo, err error) error {
		if err != nil {
			fmt.Printf("Error accessing path %q: %v\n", physicalPath, err)
			return err
		}

		if info.IsDir() {
			target = append(target, strings.Replace(physicalPath, "/data/static", "", 1))
		}

		return nil
	})

	if err != nil {
		log.Printf("Error walking the path %q: %v\n", rootPath, err)
	}

	return target
}

func findDirLastUpdatedDate(rootPath string, defaultTime time.Time) time.Time {
	result := defaultTime

	err := filepath.Walk(path.Join("/data/static", rootPath), func(physicalPath string, info os.FileInfo, err error) error {
		if err != nil {
			fmt.Printf("Error accessing path %q: %v\n", physicalPath, err)
			return err
		}

		if !info.IsDir() && result.Compare(info.ModTime()) < 0 {
			result = info.ModTime()
		}

		return nil
	})

	if err != nil {
		log.Printf("Error walking the path %q: %v\n", rootPath, err)
	}

	return result
}

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
