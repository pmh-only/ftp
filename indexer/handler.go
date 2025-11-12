package main

import (
	"fmt"
	"log"
	"net/http"
)

func handleGenRequest(w http.ResponseWriter, r *http.Request) {
	url := r.URL
	query := url.Query()

	reportPath := query.Get("path")
	if len(reportPath) < 1 {
		log.Println("indexer request received but report path not provided.")
		http.Error(w, "Failed", http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusOK)
	fmt.Fprintln(w, "process accepted")
	log.Println("indexer request received.", reportPath)

	if reportPath == "@" {
		targetDirectories := getAllTarget()
		startIndexingLoop(targetDirectories)
		return
	}

	targetDirectories := extractTargetDirectories(reportPath)
	log.Println("extracted target directories. count: ", len(targetDirectories))

	startIndexingLoop(targetDirectories)
}
