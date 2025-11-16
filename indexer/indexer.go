package main

import (
	"encoding/json"
	"fmt"
	"os"
	"path"
)

func createIndex(models []*FileModel) {
	indexDir := path.Join(rootDir, "indexes")

	for _, model := range models {
		clearedModel := model.CopyWithNoRecursive()
		clearedModel.DirectChildren = sortFileModels(clearedModel.DirectChildren)

		indexFilePath := path.Join(indexDir, model.FullPath, "index.json")

		modelString, err := json.Marshal(clearedModel)
		if err != nil {
			fmt.Println("Error during marshal file model", indexFilePath)
			continue
		}

		_ = os.MkdirAll(path.Dir(indexFilePath), 0755)
		err = os.WriteFile(indexFilePath, modelString, 0644)
		if err != nil {
			fmt.Println("Error during write file model", indexFilePath)
			continue
		}
	}
}
