package main

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"path"
)

func startIndexingLoop(targetDirectories []string) {
	for i, targetDirectory := range targetDirectories {
		log.Printf("Indexing loop item (%d/%d): %s\n", i+1, len(targetDirectories), targetDirectory)

		index := indexDirectory(targetDirectory)
		index = sortFileModels(index)

		indexFilePath := path.Join("/data/indexes/", targetDirectory, "index.json")
		marshalString, err := json.Marshal(index)
		if err != nil {
			fmt.Println("Error during marshal file model", indexFilePath)
			continue
		}

		_ = os.MkdirAll(path.Dir(indexFilePath), 0755)
		err = os.WriteFile(indexFilePath, marshalString, 0644)
		if err != nil {
			fmt.Println("Error during write file model", indexFilePath)
			continue
		}
	}
}

func indexDirectory(logicalDirPath string) []FileModel {
	fileModels := []FileModel{}

	physicalDirPath := path.Join("/data/static", logicalDirPath)
	physicalDir, err := os.Open(physicalDirPath)
	if err != nil {
		fmt.Println("Error during read directory", physicalDirPath)
		return []FileModel{}
	}

	entries, err := physicalDir.ReadDir(0)
	if err != nil {
		fmt.Println("Error during read directory", physicalDirPath)
		return []FileModel{}
	}

	for _, entryItem := range entries {
		entry, err := entryItem.Info()
		if err != nil {
			fmt.Println("Error during read entry item info", path.Join(physicalDirPath, entry.Name()))
			continue
		}

		log.Println("Builld file model for:", path.Join(physicalDirPath, entry.Name()))
		fileModel := buildFileModel(entry, physicalDirPath, logicalDirPath)
		fileModels = append(fileModels, fileModel)
	}

	return fileModels
}
