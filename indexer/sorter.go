package main

import (
	"sort"
	"strings"
)

type ByName []FileModel

func (a ByName) Len() int           { return len(a) }
func (a ByName) Less(i, j int) bool { return a[i].Name < a[j].Name }
func (a ByName) Swap(i, j int)      { a[i], a[j] = a[j], a[i] }

func sortFileModels(sourceFileModels []FileModel) []FileModel {
	directoryOnly := []FileModel{}
	fileOnly := []FileModel{}

	for _, fileModel := range sourceFileModels {
		if strings.Contains(fileModel.Type, "DIRECTORY") {
			directoryOnly = append(directoryOnly, fileModel)
		} else {
			fileOnly = append(fileOnly, fileModel)
		}
	}

	sort.Sort(ByName(directoryOnly))
	sort.Sort(ByName(fileOnly))

	return append(directoryOnly, fileOnly...)
}
