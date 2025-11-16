package main

import (
	"fmt"
	"log"
	"net/http"
)

func handleGenRequest(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	fmt.Fprintln(w, "process accepted")
	log.Println("indexer request received.")

	go startIndexJob()
}

func startIndexJob() {
	models := getWalkModels()
	createIndex(models)
}
