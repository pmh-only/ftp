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

func main() {
	log.Println("indexer started...")

	targetPath := getEnv("TARGET_PATH", "/data/static")
	absRoot, err := filepath.Abs(targetPath)
	if err != nil {
		panic(err)
	}

	http.HandleFunc("GET /", func(w http.ResponseWriter, r *http.Request) {
		flusher, ok := w.(http.Flusher)
		if !ok {
			http.Error(w, marshalJSON(ErrorModel{
				Success: false,
				Message: "INITIALIZE_STREAM_FAILED",
			}), http.StatusInternalServerError)
			return
		}

		cleaned := path.Clean("/" + r.URL.Path)
		cleaned = strings.TrimPrefix(cleaned, "/")

		dirPath := filepath.Join(absRoot, cleaned)

		sep := string(os.PathSeparator)
		if !strings.HasPrefix(dirPath, absRoot+sep) && dirPath != absRoot {
			http.Error(w, marshalJSON(ErrorModel{
				Success: false,
				Message: "PATH_TRAVERSAL_DETECTED",
			}), http.StatusForbidden)
			return
		}

		realPath, err := filepath.EvalSymlinks(dirPath)
		if err != nil {
			http.Error(w, marshalJSON(ErrorModel{
				Success: false,
				Message: "DIRECTORY_NOT_FOUND",
			}), http.StatusNotFound)
			return
		}

		if !strings.HasPrefix(realPath, absRoot+sep) && realPath != absRoot {
			http.Error(w, marshalJSON(ErrorModel{
				Success: false,
				Message: "PATH_TRAVERSAL_WITH_LINK_DETECTED",
			}), http.StatusForbidden)
			return
		}

		directory, err := os.Open(dirPath)
		if err != nil {
			http.Error(w, marshalJSON(ErrorModel{
				Success: false,
				Message: "DIRECTORY_READ_FAILURE",
			}), http.StatusInternalServerError)
			return
		}

		defer directory.Close()

		w.Header().Set("Content-Type", "text/html; charset=utf-8")
		w.Header().Set("Transfer-Encoding", "chunked")
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
				break // No more entries to read
			}

			e := entries[0]

			select {
			case <-r.Context().Done():
				log.Println("client cancelled")
				return
			default:
			}

			name := e.Name()
			displayName := name
			if e.IsDir() {
				displayName += "/"
			}

			ftype := "FILE"
			if e.IsDir() {
				ftype = "DIRECTORY"
			}

			linkedTo := ""
			if e.Mode()&os.ModeSymlink != 0 {
				ftype = "LINK_TO_"

				targetPath, err := os.Readlink(path.Join(dirPath, name))
				if err != nil {
					fmt.Printf("Error reading symbolic link target: %v\n", err)
					continue
				}

				linkToStat, err := os.Stat(path.Join(dirPath, targetPath))
				if err != nil {
					fmt.Printf("Error reading symbolic link target: %v\n", err)
					continue
				}

				if linkToStat.IsDir() {
					ftype += "DIRECTORY"
					displayName += "/"
				} else {
					ftype += "FILE"
				}

				linkedTo = targetPath
			}

			size := ptr(e.Size())
			if e.IsDir() {
				size = nil
			}

			fmt.Fprintln(w, ",")
			fmt.Fprint(
				w, marshalJSON(FileModel{
					Name:       displayName,
					Type:       ftype,
					Bytes:      size,
					FullPath:   path.Join("/"+cleaned, displayName),
					LastUpdate: e.ModTime(),
					LinkedTo:   linkedTo,
				}))

			if fileIndex%20 == 0 {
				flusher.Flush()
			}
			fileIndex++
		}

		fmt.Fprintln(w, "]}")
		flusher.Flush()
	})

	log.Fatal(http.ListenAndServe(":8080", nil))
}
