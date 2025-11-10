package main

import (
	"encoding/json"
	"log"
	"os"
)

func getEnv(key, _default string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}

	return _default
}

func marshalJSON(object any) string {
	jsonData, err := json.Marshal(object)
	if err != nil {
		log.Fatalln(err)
		return ""
	}

	return string(jsonData)
}
