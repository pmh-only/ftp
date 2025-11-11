package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"path"
	"path/filepath"
	"strings"
)

func newMachineReadableHandler(absRoot string) http.HandlerFunc {
	sep := string(os.PathSeparator)

	return func(w http.ResponseWriter, r *http.Request) {
		flusher, ok := w.(http.Flusher)
		if !ok {
			respondWithJSONError(w, http.StatusInternalServerError, "INITIALIZE_STREAM_FAILED")
			return
		}

		cleaned := path.Clean("/" + r.URL.Path)
		cleaned = strings.TrimPrefix(cleaned, "/")

		dirPath := filepath.Join(absRoot, cleaned)
		if !isWithinRoot(dirPath, absRoot, sep) {
			respondWithJSONError(w, http.StatusForbidden, "PATH_TRAVERSAL_DETECTED")
			return
		}

		realPath, err := filepath.EvalSymlinks(dirPath)
		if err != nil {
			respondWithJSONError(w, http.StatusNotFound, "DIRECTORY_NOT_FOUND")
			return
		}

		if !isWithinRoot(realPath, absRoot, sep) {
			respondWithJSONError(w, http.StatusForbidden, "PATH_TRAVERSAL_WITH_LINK_DETECTED")
			return
		}

		directory, err := os.Open(dirPath)
		if err != nil {
			respondWithJSONError(w, http.StatusInternalServerError, "DIRECTORY_READ_FAILURE")
			return
		}
		defer directory.Close()

		w.Header().Set("Content-Type", "text/html; charset=utf-8")
		w.Header().Set("Transfer-Encoding", "chunked")

		if _, ok := os.LookupEnv("CORS_ENABLED"); ok {
			w.Header().Add("Access-Control-Allow-Origin", "*")
		}

		w.WriteHeader(http.StatusOK)

		fmt.Fprintln(w, "{\"success\":true,\"files\":[")
		flusher.Flush()

		fileIndex := 0
		for {
			entries, err := directory.Readdir(1)
			if err != nil {
				if err.Error() == "EOF" {
					break
				}

				log.Fatalf("Error reading directory entries: %v", err)
			}

			if len(entries) == 0 {
				break
			}

			select {
			case <-r.Context().Done():
				log.Println("client cancelled")
				return
			default:
			}

			entry := entries[0]
			fileModel := buildFileModel(entry, dirPath, cleaned)

			if fileIndex != 0 {
				fmt.Fprintln(w, ",")
			}

			fmt.Fprint(w, marshalJSON(fileModel))

			if fileIndex%20 == 0 {
				flusher.Flush()
			}
			fileIndex++
		}

		fmt.Fprintln(w, "\n]}")
		flusher.Flush()
	}
}
