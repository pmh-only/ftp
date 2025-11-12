package main

import (
	"bufio"
	"log"
	"os"
	"path"
	"regexp"
	"slices"
	"strings"
)

func extractTargetDirectories(reportPath string) []string {
	targetDirectories := []string{}

	file, err := os.Open(reportPath)
	if err != nil {
		log.Printf("Error opening file: %v", err)
		return []string{}
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		line := scanner.Text()

		isChange, _ := regexp.MatchString("^[><ch]", line)
		isDelete, _ := regexp.MatchString("^*deleting", line)

		if !isChange && !isDelete {
			continue
		}

		targetFile := strings.Split(line, " ")[1]
		targetDirectory := path.Join(targetFile, "..")
		targetDirectories = append(targetDirectories, targetDirectory)
	}

	if err := scanner.Err(); err != nil {
		log.Printf("Error during scanning: %v", err)
		return []string{}
	}

	slices.Sort(targetDirectories)
	return slices.Compact(targetDirectories)
}
