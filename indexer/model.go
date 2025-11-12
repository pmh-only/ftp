package main

import (
	"fmt"
	"os"
	"path"
	"strings"
	"time"
)

type FileModel struct {
	Name       string    `json:"name"`
	Type       string    `json:"type"`
	LinkedTo   string    `json:"linkedTo,omitempty"`
	Bytes      *int64    `json:"bytes,omitempty"`
	FullPath   string    `json:"fullPath"`
	LastUpdate time.Time `json:"lastUpdate"`
}

func buildFileModel(entry os.FileInfo, physicalDirPath, logicalDirPath string) FileModel {
	name := entry.Name()
	displayName := name
	fullPath := path.Join("/"+logicalDirPath, displayName)
	if entry.IsDir() {
		displayName += "/"
		fullPath += "/"
	}

	ftype := "FILE"
	if entry.IsDir() {
		ftype = "DIRECTORY"
	}

	size := ptr(entry.Size())
	linkedTo := ""
	if entry.Mode()&os.ModeSymlink != 0 {
		linkType, linkedToPtr, sizePtr := buildFileLinkedTo(physicalDirPath, name)

		ftype = linkType
		if linkedToPtr != nil {
			linkedTo = "/" + path.Join(logicalDirPath, *linkedToPtr)
		}

		if sizePtr != nil {
			size = sizePtr
		}
	}

	if ftype == "LINK_DIRECTORY" {
		displayName += "/"
		linkedTo += "/"
		fullPath += "/"
	}

	if strings.Contains(ftype, "DIRECTORY") {
		size = nil
	}

	return FileModel{
		Name:       displayName,
		Type:       ftype,
		Bytes:      size,
		FullPath:   fullPath,
		LastUpdate: entry.ModTime(),
		LinkedTo:   linkedTo,
	}
}

func buildFileLinkedTo(dirPath, name string) (ftype string, linkedTo *string, size *int64) {
	targetPath, err := os.Readlink(path.Join(dirPath, name))
	if err != nil {
		fmt.Printf("Error reading symbolic link target: %v\n", err)
		return "LINK", nil, nil
	}

	linkToStat, err := os.Stat(path.Join(dirPath, targetPath))
	if err != nil {
		fmt.Printf("Error reading symbolic link target: %v\n", err)
		return "LINK", &targetPath, nil
	}

	if linkToStat.IsDir() {
		return "LINK_DIRECTORY", &targetPath, nil
	}

	return "LINK_FILE", &targetPath, ptr(linkToStat.Size())
}
