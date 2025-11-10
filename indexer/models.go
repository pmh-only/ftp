package main

import "time"

type ErrorModel struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}

type FileModel struct {
	Name       string    `json:"name"`
	Type       string    `json:"type"`
	LinkedTo   string    `json:"linkedTo,omitempty"`
	Bytes      string    `json:"bytes,omitempty"`
	FullPath   string    `json:"fullPath"`
	LastUpdate time.Time `json:"lastUpdate"`
}
