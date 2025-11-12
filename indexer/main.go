package main

import (
	"log"
	"net/http"
)

func main() {
	log.Println("indexer server started.")
	http.HandleFunc("GET /gen", handleGenRequest)

	log.Fatal(http.ListenAndServe(":8080", nil))
}
