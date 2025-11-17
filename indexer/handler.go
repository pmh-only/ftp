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
	if err := rebuildIndexes(); err != nil {
		log.Println("error during index job:", err)
	}
}
