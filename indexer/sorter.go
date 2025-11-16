package main

import (
	"strings"
)

func sortFileModels(sourceFileModels []*FileModel) []*FileModel {
	directoryOnly := []*FileModel{}
	fileOnly := []*FileModel{}

	for _, fileModel := range sourceFileModels {
		if strings.Contains(fileModel.Type, "DIRECTORY") {
			directoryOnly = append(directoryOnly, fileModel)
		} else {
			fileOnly = append(fileOnly, fileModel)
		}
	}

	return append(directoryOnly, fileOnly...)
}
