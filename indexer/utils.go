package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"strings"
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

func ptr[T any](v T) *T {
	return &v
}

func respondWithJSONError(w http.ResponseWriter, status int, message string) {
	http.Error(w, marshalJSON(ErrorModel{
		Success: false,
		Message: message,
	}), status)
}

func isWithinRoot(target, root, sep string) bool {
	return strings.HasPrefix(target, root+sep) || target == root
}
