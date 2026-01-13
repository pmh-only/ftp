package main

import (
	"context"
	"errors"
	"flag"
	"log"
	"os"
	"os/signal"
	"syscall"
)

func main() {
	mode := flag.String("mode", "hub", "hub|spoke")
	listen := flag.String("listen", ":8080", "hub websocket listen addr")
	listenSSE := flag.String("listen-sse", ":8081", "hub SSE listen addr")
	hubWS := flag.String("hub", "ws://127.0.0.1:8080/ws", "hub websocket url (spoke mode)")
	iface := flag.String("iface", "eth0", "interface to collect (spoke mode)")
	spokeID := flag.String("id", getSpokeId(), "spoke id (spoke mode)")
	flag.Parse()

	ctx, cancel := signalContext()
	defer cancel()

	switch *mode {
	case "hub":
		if err := runHub(ctx, *listen, *listenSSE); err != nil && !errors.Is(err, context.Canceled) {
			log.Fatal(err)
		}
	case "spoke":
		if err := runSpoke(ctx, *hubWS, *iface, *spokeID); err != nil && !errors.Is(err, context.Canceled) {
			log.Fatal(err)
		}
	default:
		log.Fatalf("unknown mode: %s", *mode)
	}
}

func signalContext() (context.Context, context.CancelFunc) {
	ctx, cancel := context.WithCancel(context.Background())
	ch := make(chan os.Signal, 2)
	signal.Notify(ch, syscall.SIGINT, syscall.SIGTERM)
	go func() {
		<-ch
		cancel()
	}()
	return ctx, cancel
}

func getSpokeId() string {
	if v, ok := os.LookupEnv("SPOKE_ID"); ok {
		return v
	}

	return "unknown"
}
