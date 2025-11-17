package main

import (
	"io/fs"
	"log"
	"os"
	"path"
	"path/filepath"
	"strings"
	"time"

	_ "time/tzdata"
)

type walkStats struct {
	directories int64
	lastLog     time.Time
}

const (
	progressStep     = 250
	progressInterval = 2 * time.Second
)

func newWalkStats() *walkStats {
	return &walkStats{lastLog: time.Now()}
}

func (s *walkStats) recordDirectory() {
	s.directories++
	if s.directories == 1 || s.directories%progressStep == 0 || time.Since(s.lastLog) >= progressInterval {
		log.Printf("indexed %d directories so far", s.directories)
		s.lastLog = time.Now()
	}
}

func rebuildIndexes() error {
	staticPath := path.Join(rootDir, "static")
	log.Println("starting index rebuild for:", staticPath)

	info, err := os.Stat(staticPath)
	if err != nil {
		return err
	}

	start := time.Now()
	stats := newWalkStats()

	// Walk the directory tree depth-first and write indexes as soon as a directory is processed.
	_, err = walkDirectory(staticPath, staticPath, fs.FileInfoToDirEntry(info), stats)
	if err != nil {
		return err
	}

	log.Printf("index rebuild finished in %s (%d directories)", time.Since(start).Round(time.Millisecond), stats.directories)
	return nil
}

func walkDirectory(staticRoot, absPath string, entry fs.DirEntry, stats *walkStats) (*FileModel, error) {
	model := createModelFromEntry(staticRoot, absPath, entry)
	if model == nil {
		return nil, nil
	}

	if !entry.IsDir() {
		return model, nil
	}

	dirEntries, err := os.ReadDir(absPath)
	if err != nil {
		log.Println("Error", err.Error(), "has been occured when reading dir:", absPath, "skip.")
		return model, nil
	}

	for _, childEntry := range dirEntries {
		childPath := filepath.Join(absPath, childEntry.Name())

		var childModel *FileModel
		if childEntry.IsDir() {
			childModel, err = walkDirectory(staticRoot, childPath, childEntry, stats)
			if err != nil {
				return nil, err
			}
		} else {
			childModel = createModelFromEntry(staticRoot, childPath, childEntry)
		}

		if childModel == nil {
			continue
		}

		updateDirectoryModel(model, childModel)
	}

	model.DirectChildren = sortFileModels(model.DirectChildren)

	if err := writeIndex(model); err != nil {
		return nil, err
	}

	stats.recordDirectory()

	// Clear children so parents store shallow copies only.
	model.DirectChildren = nil
	return model, nil
}

func updateDirectoryModel(parent, child *FileModel) {
	if !strings.HasSuffix(child.Type, "_LINKED") {
		parent.Bytes += child.Bytes
		parent.BytesReadable = formatBytes(parent.Bytes)
	}

	parent.TotalChildrenCount += child.TotalChildrenCount + 1

	if parent.LastUpdate.Before(child.LastUpdate) {
		parent.LastUpdate = child.LastUpdate
		parent.LastUpdateReadable = child.LastUpdateReadable
	}

	parent.DirectChildren = append(parent.DirectChildren, child)
}
