package main

import (
	"io/fs"
	"log"
	"os"
	"path"
	"strings"
	"time"

	_ "time/tzdata"
)

type FileModel struct {
	Name               string       `json:"name"`
	Type               string       `json:"type"`
	LinkedTo           string       `json:"linkedTo,omitempty"`
	Bytes              int64        `json:"bytes"`
	BytesReadable      string       `json:"bytesReadable"`
	FullPath           string       `json:"fullPath"`
	LastUpdate         time.Time    `json:"lastUpdate"`
	LastUpdateReadable string       `json:"lastUpdateReadable"`
	TotalChildrenCount int64        `json:"totalChildrenCount"`
	DirectChildren     []*FileModel `json:"directChildren"`
}

func createModelFromEntry(staticDir, filePath string, entry fs.DirEntry) *FileModel {
	loc, err := time.LoadLocation("Asia/Seoul")
	if err != nil {
		log.Fatalln("Error has been occured during get location data", err)
		return nil
	}

	info, err := entry.Info()
	if err != nil {
		log.Println("Error", err.Error(), "has been occured when fetching data into:", filePath, "skip.")
		return nil
	}

	isDir := entry.IsDir()
	isSymLink := info.Mode()&os.ModeSymlink != 0
	logicalPath := strings.Replace(filePath, staticDir, "", 1)

	name := entry.Name()
	if len(logicalPath) < 1 {
		logicalPath = ""
		name = "root"
	}

	ftype := "FILE"
	if isDir {
		ftype = "DIRECTORY"
		name += "/"
		logicalPath += "/"
	}

	linkedTo := ""

	var byteSize int64 = 0
	if !isDir && !isSymLink {
		byteSize = info.Size()
	}

	lastUpdate := info.ModTime()

	if isSymLink {
		linkedToPhysical, err := os.Readlink(filePath)
		linkedToPhysical = path.Join(path.Dir(filePath), linkedToPhysical)

		if err != nil {
			log.Println("Error", err.Error(), "has been occured when read symlink data for:", filePath, "skip.")
			return nil
		}

		info, err := os.Stat(linkedToPhysical)
		if err != nil {
			// log.Println("Error", err.Error(), "has been occured when read symlink's linked file data for:", filePath, "skip.")
			return nil
		}

		ftype = "FILE_LINKED"
		linkedTo = strings.Replace(linkedToPhysical, staticDir, "", 1)
		byteSize = info.Size()
		lastUpdate = info.ModTime()

		if info.IsDir() {
			ftype = "DIRECTORY_LINKED"
			linkedTo += "/"
			logicalPath += "/"
			name += "/"
		}
	}

	return &FileModel{
		Name:               name,
		Type:               ftype,
		LinkedTo:           linkedTo,
		Bytes:              byteSize,
		BytesReadable:      formatBytes(byteSize),
		FullPath:           logicalPath,
		LastUpdate:         lastUpdate,
		LastUpdateReadable: lastUpdate.In(loc).Format("2006-01-02 15:04:05") + " KST",
		DirectChildren:     []*FileModel{},
		TotalChildrenCount: 0,
	}
}
