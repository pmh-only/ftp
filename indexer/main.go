package main

import (
	"fmt"
	"html"
	"log"
	"net/http"
	"os"
	"path"
	"path/filepath"
	"strings"
	"time"
)

func main() {
	log.Println("indexer started...")

	targetPath := "/data/static"
	absRoot, err := filepath.Abs(targetPath)
	if err != nil {
		panic(err)
	}

	fs := http.FileServer(http.Dir("./assets"))
	http.Handle("GET /_assets/", http.StripPrefix("/_assets/", fs))

	http.HandleFunc("GET /", func(w http.ResponseWriter, r *http.Request) {
		flusher, ok := w.(http.Flusher)
		if !ok {
			http.Error(w, "Streaming not supported", http.StatusInternalServerError)
			return
		}

		cleaned := path.Clean("/" + r.URL.Path)
		cleaned = strings.TrimPrefix(cleaned, "/")

		dirPath := filepath.Join(absRoot, cleaned)

		sep := string(os.PathSeparator)
		if !strings.HasPrefix(dirPath, absRoot+sep) && dirPath != absRoot {
			http.Error(w, "forbidden", http.StatusForbidden)
			return
		}

		realPath, err := filepath.EvalSymlinks(dirPath)
		if err != nil {
			http.Error(w, "not found", http.StatusNotFound)
			return
		}

		if !strings.HasPrefix(realPath, absRoot+sep) && realPath != absRoot {
			http.Error(w, "forbidden", http.StatusForbidden)
			return
		}

		entries, err := os.ReadDir(dirPath)
		if err != nil {
			http.Error(w, "Cannot read directory", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "text/html; charset=utf-8")

		fmt.Fprintf(w, "<!doctype html><html><head><title>Index of /%s</title>\n",
			html.EscapeString(cleaned))
		fmt.Fprint(w, "<link rel='stylesheet' type='text/css' href='/_assets/styles.css'>\n")
		fmt.Fprint(w, "<script src='/_assets/script.js'></script></head><body>\n")
		fmt.Fprintf(w, "<h1>Index of /%s</h1>\n", html.EscapeString(cleaned))
		fmt.Fprint(w, "<table border='1' cellpadding='4' cellspacing='0'>\n")
		fmt.Fprint(w, "<tr><th>Name</th><th>Size (bytes)</th><th>Modified</th></tr>\n")
		fmt.Fprint(w, "<tr><td><a href='.'>.</a></td><td></td><td></td></tr>\n")
		fmt.Fprint(w, "<tr><td><a href='..'>.,</a></td><td></td><td></td></tr>\n")
		flusher.Flush()

		for i, e := range entries {
			select {
			case <-r.Context().Done():
				log.Println("client cancelled")
				return
			default:
			}

			info, err := e.Info()
			if err != nil {
				continue
			}

			name := e.Name()
			displayName := name
			if e.IsDir() {
				displayName += "/"
			}

			size := fmt.Sprint(formatBytes(info.Size()))
			if e.IsDir() {
				size = "DIR"
			}

			modTime := info.ModTime().Format(time.RFC1123)

			fmt.Fprintf(
				w,
				"<tr><td><a href='%s'>%s</a></td><td align='right'>%s</td><td>%s</td></tr>\n",
				html.EscapeString(displayName),
				html.EscapeString(displayName),
				size,
				html.EscapeString(modTime),
			)

			if i%20 == 0 {
				flusher.Flush()
			}
		}

		fmt.Fprint(w, "</table></body></html>")
		flusher.Flush()
	})

	log.Fatal(http.ListenAndServe(":8080", nil))
}
