package main

import (
	"io/fs"
	"log"
	"maps"
	"path"
	"path/filepath"
	"slices"
	"strings"

	_ "time/tzdata"
)

func getWalkModels() []*FileModel {
	files := map[string]*FileModel{}
	staticPath := path.Join(rootDir, "static")

	filepath.WalkDir(staticPath, func(path string, entry fs.DirEntry, err error) error {
		if err != nil {
			log.Println("Error", err.Error(), "has been occured when walking into:", path, "skip.")
			return nil
		}

		model := createModelFromEntry(staticPath, path, entry)
		if model == nil {
			return nil
		}

		if model.Type == "DIRECTORY" {
			files[model.FullPath] = model
		}

		if model.FullPath == "/" {
			return nil
		}

		pathSlices := strings.Split(model.FullPath, "/")[1:]
		if strings.HasSuffix(model.FullPath, "/") {
			pathSlices = pathSlices[:len(pathSlices)-1]
		}

		for i := range pathSlices {
			parentPath := "/"
			if i > 0 {
				parentPath += strings.Join(pathSlices[:i], "/") + "/"
			}

			// log.Println(model.FullPath, "->", parentPath, "#", i, len(pathSlices)-1)
			parentModel, ok := files[parentPath]
			if !ok {
				continue
			}

			parentModel.Bytes += model.Bytes
			parentModel.BytesReadable = formatBytes(parentModel.Bytes)
			parentModel.TotalChildrenCount += 1

			if parentModel.LastUpdate.Before(model.LastUpdate) {
				parentModel.LastUpdate = model.LastUpdate
				parentModel.LastUpdateReadable = model.LastUpdateReadable
			}

			if i == len(pathSlices)-1 {
				parentModel.DirectChildren = append(parentModel.DirectChildren, model)
			}

			files[parentPath] = parentModel
		}

		return nil
	})

	return slices.Collect(maps.Values(files))
}
