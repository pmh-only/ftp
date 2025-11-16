package main

import (
	"io/fs"
	"log"
	"os"
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
	DirectChildren     []*FileModel `json:"directChildren"`
	TotalChildrenCount int64        `json:"totalChildrenCount"`
}

func createModelFromEntry(staticDir, path string, entry fs.DirEntry) *FileModel {
	loc, err := time.LoadLocation("Asia/Seoul")
	if err != nil {
		log.Fatalln("Error has been occured during get location data", err)
		return nil
	}

	info, err := entry.Info()
	if err != nil {
		log.Println("Error", err.Error(), "has been occured when fetching data into:", path, "skip.")
		return nil
	}

	isDir := entry.IsDir()
	isSymLink := info.Mode()&os.ModeSymlink != 0
	logicalPath := strings.Replace(path, staticDir, "", 1)

	name := entry.Name()
	if len(logicalPath) < 1 {
		logicalPath = "/"
		name = "root"
	}

	ftype := "FILE"
	if isDir {
		ftype = "DIRECTORY"
	}

	if isSymLink {
		ftype += "_LINKED"
	}

	linkedTo := ""
	linkedToPhysical := ""

	if isSymLink {
		linkedToPhysical, err = os.Readlink(path)

		if err != nil {
			log.Println("Error", err.Error(), "has been occured when read symlink data for:", path, "skip.")
			return nil
		}

		linkedTo = strings.Replace(linkedToPhysical, staticDir, "", 1)
	}

	var byteSize int64 = 0
	if !isDir && !isSymLink {
		byteSize = info.Size()
	}

	byteSizeReadable := formatBytes(byteSize)

	lastUpdate := info.ModTime()
	if isSymLink {
		info, err := os.Stat(linkedToPhysical)
		if err != nil {
			// log.Println("Error", err.Error(), "has been occured when read symlink's linked file data for:", path, "skip.")
			return nil
		}

		lastUpdate = info.ModTime()
	}

	lastUpdateReadable := lastUpdate.In(loc).Format("2006-01-02 15:04:05") + " KST"

	return &FileModel{
		Name:               name,
		Type:               ftype,
		LinkedTo:           linkedTo,
		Bytes:              byteSize,
		BytesReadable:      byteSizeReadable,
		FullPath:           logicalPath,
		LastUpdate:         lastUpdate,
		LastUpdateReadable: lastUpdateReadable,
		DirectChildren:     []*FileModel{},
		TotalChildrenCount: 0,
	}
}

func (model FileModel) CopyWithNoRecursive() FileModel {
	directChildren := []*FileModel{}
	for _, directChild := range model.DirectChildren {
		directChildren = append(directChildren, &FileModel{
			Name:               directChild.Name,
			Type:               directChild.Type,
			LinkedTo:           directChild.LinkedTo,
			Bytes:              directChild.Bytes,
			BytesReadable:      directChild.BytesReadable,
			FullPath:           directChild.FullPath,
			LastUpdate:         directChild.LastUpdate,
			LastUpdateReadable: directChild.LastUpdateReadable,
			DirectChildren:     nil,
			TotalChildrenCount: directChild.TotalChildrenCount,
		})
	}

	return FileModel{
		Name:               model.Name,
		Type:               model.Type,
		LinkedTo:           model.LinkedTo,
		Bytes:              model.Bytes,
		BytesReadable:      model.BytesReadable,
		FullPath:           model.FullPath,
		LastUpdate:         model.LastUpdate,
		LastUpdateReadable: model.LastUpdateReadable,
		DirectChildren:     directChildren,
		TotalChildrenCount: model.TotalChildrenCount,
	}
}
