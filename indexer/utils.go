package main

import (
	"fmt"
	"log"
	"os"
	"path/filepath"
	"strings"
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
