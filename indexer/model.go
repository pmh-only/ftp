package main

import (
	"fmt"
	"os"
	"path"
	"strings"
	"time"

	_ "time/tzdata"
)

type FileModel struct {
	Name               string    `json:"name"`
	Type               string    `json:"type"`
	LinkedTo           string    `json:"linkedTo,omitempty"`
	Bytes              *int64    `json:"bytes,omitempty"`
	BytesReadable      string    `json:"bytesReadable,omitempty"`
	FullPath           string    `json:"fullPath"`
	LastUpdate         time.Time `json:"lastUpdate"`
	LastUpdateReadable string    `json:"lastUpdateReadable"`
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
			linkedTo = path.Join(logicalDirPath, *linkedToPtr)
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

	loc, _ := time.LoadLocation("Asia/Seoul")

	bytesReadable := ""
	if size != nil {
		bytesReadable = formatBytes(*size)
	}

	return FileModel{
		Name:               displayName,
		Type:               ftype,
		LinkedTo:           linkedTo,
		Bytes:              size,
		BytesReadable:      bytesReadable,
		FullPath:           fullPath,
		LastUpdate:         entry.ModTime(),
		LastUpdateReadable: entry.ModTime().In(loc).Format("2006-01-02 15:04:05") + " KST",
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
