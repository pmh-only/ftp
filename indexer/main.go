package main

import (
	"log"
	"net/http"
	"path/filepath"
	"strings"
)

func main() {
	log.Println("indexer started...")

	targetPath := getEnv("TARGET_PATH", "/data/static")
	absRoot, err := filepath.Abs(targetPath)
	if err != nil {
		panic(err)
	}

	mux := http.NewServeMux()
	fs := http.FileServer(http.Dir("public"))

	mux.Handle("GET /_assets/", http.StripPrefix("/_assets/", fs))
	mux.HandleFunc("GET /", func(w http.ResponseWriter, r *http.Request) {
		ua := strings.ToLower(r.Header.Get("User-Agent"))
		ov := strings.ToLower(r.Header.Get("X-Override-For"))

		if strings.HasPrefix(ua, "mozilla/") && ov != "machine" {
			http.ServeFile(w, r, "./public/index.html")
			return
		}

		newMachineReadableHandler(absRoot)(w, r)
	})

	log.Fatal(http.ListenAndServe(":8080", mux))
}
