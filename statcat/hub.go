package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"sync"
	"time"

	"github.com/coder/websocket"
)

type Store struct {
	mu      sync.RWMutex
	metrics map[string]SpokeMetric
}

func NewStore() *Store { return &Store{metrics: make(map[string]SpokeMetric)} }

func (s *Store) Upsert(m SpokeMetric) {
	s.mu.Lock()
	s.metrics[m.SpokeID] = m
	s.mu.Unlock()
}

func (s *Store) Snapshot() map[string]SpokeMetric {
	s.mu.RLock()
	defer s.mu.RUnlock()
	out := make(map[string]SpokeMetric, len(s.metrics))
	for k, v := range s.metrics {
		out[k] = v
	}
	return out
}

type SSEBroker struct {
	mu      sync.Mutex
	clients map[chan []byte]struct{}
}

func NewSSEBroker() *SSEBroker { return &SSEBroker{clients: make(map[chan []byte]struct{})} }

func (b *SSEBroker) Add() chan []byte {
	ch := make(chan []byte, 16)
	b.mu.Lock()
	b.clients[ch] = struct{}{}
	b.mu.Unlock()
	return ch
}

func (b *SSEBroker) Remove(ch chan []byte) {
	b.mu.Lock()
	delete(b.clients, ch)
	b.mu.Unlock()
	close(ch)
}

// Broadcast drops to slow clients to prevent global blocking.
func (b *SSEBroker) Broadcast(msg []byte) {
	b.mu.Lock()
	defer b.mu.Unlock()
	for ch := range b.clients {
		select {
		case ch <- msg:
		default:
		}
	}
}

func runHub(ctx context.Context, listenWS string, listenSSE string) error {
	store := NewStore()
	broker := NewSSEBroker()

	// Snapshot every second; every SSE client receives the same snapshot event.
	go func() {
		t := time.NewTicker(1 * time.Second)
		defer t.Stop()
		for {
			select {
			case <-ctx.Done():
				return
			case <-t.C:
				snap := store.Snapshot()
				b, _ := json.Marshal(snap)
				broker.Broadcast(b)
			}
		}
	}()

	// Create separate servers for WebSocket and SSE endpoints
	wsMux := http.NewServeMux()
	wsMux.HandleFunc("/ws", wsIngestHandler(store))

	sseMux := http.NewServeMux()
	sseMux.HandleFunc("/sse", sseHandler(broker))

	wsSrv := &http.Server{
		Addr:              listenWS,
		Handler:           wsMux,
		ReadHeaderTimeout: 5 * time.Second,
	}

	sseSrv := &http.Server{
		Addr:              listenSSE,
		Handler:           sseMux,
		ReadHeaderTimeout: 5 * time.Second,
	}

	errCh := make(chan error, 2)
	go func() {
		log.Printf("hub websocket listening on %s", listenWS)
		errCh <- wsSrv.ListenAndServe()
	}()

	go func() {
		log.Printf("hub SSE listening on %s", listenSSE)
		errCh <- sseSrv.ListenAndServe()
	}()

	select {
	case <-ctx.Done():
		shutdownCtx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()
		_ = wsSrv.Shutdown(shutdownCtx)
		_ = sseSrv.Shutdown(shutdownCtx)
		return ctx.Err()
	case err := <-errCh:
		// If one server fails, shutdown both
		shutdownCtx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()
		_ = wsSrv.Shutdown(shutdownCtx)
		_ = sseSrv.Shutdown(shutdownCtx)
		return err
	}
}

func wsIngestHandler(store *Store) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		c, err := websocket.Accept(w, r, &websocket.AcceptOptions{
			// Add origin validation/auth as needed.
		})
		if err != nil {
			return
		}
		defer c.Close(websocket.StatusNormalClosure, "bye")

		ctx := r.Context()
		for {
			_, data, err := c.Read(ctx)
			if err != nil {
				return
			}
			var m SpokeMetric
			if err := json.Unmarshal(data, &m); err != nil {
				continue
			}
			store.Upsert(m)
		}
	}
}

func sseHandler(broker *SSEBroker) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/event-stream")
		w.Header().Set("Cache-Control", "no-cache")
		w.Header().Set("Connection", "keep-alive")
		w.Header().Set("X-Accel-Buffering", "no")

		flusher, ok := w.(http.Flusher)
		if !ok {
			http.Error(w, "streaming unsupported", http.StatusInternalServerError)
			return
		}

		ch := broker.Add()
		defer broker.Remove(ch)

		ctx := r.Context()

		fmt.Fprintf(w, "retry: %d\n\n", 3000)
		flusher.Flush()

		keepAlive := time.NewTicker(15 * time.Second)
		defer keepAlive.Stop()

		for {
			select {
			case <-ctx.Done():
				return
			case <-keepAlive.C:
				fmt.Fprint(w, ": keep-alive\n\n")
				flusher.Flush()
			case msg := <-ch:
				// Single shared event type; all clients receive identical snapshots per tick.
				fmt.Fprint(w, "event: metrics\n")
				fmt.Fprint(w, "data: ")
				_, _ = w.Write(msg)
				fmt.Fprint(w, "\n\n")
				flusher.Flush()
			}
		}
	}
}
