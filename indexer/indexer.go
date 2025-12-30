package main

import (
	"encoding/json"
	"fmt"
	"os"
	"path"
)

func writeIndex(model *FileModel) error {
	if model.Type != "DIRECTORY" {
		return nil
	}

	err := createIndexDirectory(model)
	if err != nil {
		return err
	}

	err = writeJsonIndex(model)
	if err != nil {
		return err
	}

	err = writeHTMLIndex(model)
	if err != nil {
		return err
	}

	return nil
}

func createIndexDirectory(model *FileModel) error {
	indexDir := path.Join(rootDir, "indexes")
	indexFilePath := path.Join(indexDir, model.FullPath, "index.json")

	if err := os.MkdirAll(path.Dir(indexFilePath), 0o755); err != nil {
		return fmt.Errorf("creating index dir for %s: %w", indexFilePath, err)
	}

	return nil
}

func writeJsonIndex(model *FileModel) error {
	indexDir := path.Join(rootDir, "indexes")
	indexFilePath := path.Join(indexDir, model.FullPath, "index.json")

	file, err := os.OpenFile(indexFilePath, os.O_CREATE|os.O_WRONLY|os.O_TRUNC, 0o644)
	if err != nil {
		return fmt.Errorf("opening index file %s: %w", indexFilePath, err)
	}
	defer file.Close()

	if err := json.NewEncoder(file).Encode(model); err != nil {
		return fmt.Errorf("encoding index %s: %w", indexFilePath, err)
	}

	return nil
}

func writeHTMLIndex(model *FileModel) error {
	indexDir := path.Join(rootDir, "indexes")
	indexFilePath := path.Join(indexDir, model.FullPath, "index.html")

	file, err := os.OpenFile(indexFilePath, os.O_CREATE|os.O_WRONLY|os.O_TRUNC, 0o644)
	if err != nil {
		return fmt.Errorf("opening index file %s: %w", indexFilePath, err)
	}
	defer file.Close()

	if err := htmlTemplate.Execute(file, model); err != nil {
		return fmt.Errorf("encoding index %s: %w", indexFilePath, err)
	}

	return nil
}
