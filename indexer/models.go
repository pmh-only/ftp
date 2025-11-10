package main

import (
	"fmt"
	"os"
	"path"
	"time"
)

type ErrorModel struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}

type FileModel struct {
	Name       string    `json:"name"`
	Type       string    `json:"type"`
	LinkedTo   string    `json:"linkedTo,omitempty"`
	Bytes      *int64    `json:"bytes,omitempty"`
	FullPath   string    `json:"fullPath"`
	LastUpdate time.Time `json:"lastUpdate"`
}

func buildFileModel(entry os.FileInfo, dirPath, cleaned string) FileModel {
	name := entry.Name()
	displayName := name
	if entry.IsDir() {
		displayName += "/"
	}

	ftype := "FILE"
	if entry.IsDir() {
		ftype = "DIRECTORY"
	}

	linkedTo := ""
	if entry.Mode()&os.ModeSymlink != 0 {
		linkType, linkedToPtr := buildFileLinkedTo(dirPath, name)

		ftype = linkType
		if linkedToPtr != nil {
			linkedTo = *linkedToPtr
		}
	}

	size := ptr(entry.Size())
	if entry.IsDir() {
		size = nil
	}

	return FileModel{
		Name:       displayName,
		Type:       ftype,
		Bytes:      size,
		FullPath:   path.Join("/"+cleaned, displayName),
		LastUpdate: entry.ModTime(),
		LinkedTo:   linkedTo,
	}
}

func buildFileLinkedTo(dirPath, name string) (ftype string, linkedTo *string) {
	targetPath, err := os.Readlink(path.Join(dirPath, name))
	if err != nil {
		fmt.Printf("Error reading symbolic link target: %v\n", err)
		return "LINK", nil
	}

	linkToStat, err := os.Stat(path.Join(dirPath, targetPath))
	if err != nil {
		fmt.Printf("Error reading symbolic link target: %v\n", err)
		return "LINK", &targetPath
	}

	if linkToStat.IsDir() {
		return "LINK_DIRECTORY", &targetPath
	}

	return "LINK_FILE", &targetPath
}
