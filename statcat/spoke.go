package main

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/coder/websocket"
)

func runSpoke(ctx context.Context, hubWS, iface, spokeID string) error {
	prevStats, err := readIfaceStats(iface)
	if err != nil {
		return fmt.Errorf("read interface counters: %w", err)
	}

	// Produce one metric per second into a channel.
	metricCh := make(chan SpokeMetric, 4)
	go func() {
		t := time.NewTicker(1 * time.Second)
		defer t.Stop()
		for {
			select {
			case <-ctx.Done():
				close(metricCh)
				return
			case <-t.C:
				stats, err := readIfaceStats(iface)
				if err != nil {
					// Interface missing/down; skip until it recovers.
					continue
				}
				rxBps := stats.rxBytes - prevStats.rxBytes
				txBps := stats.txBytes - prevStats.txBytes
				rxPps := stats.rxPackets - prevStats.rxPackets
				txPps := stats.txPackets - prevStats.txPackets
				if rxBps < 0 || txBps < 0 {
					rxBps, txBps = 0, 0
				}
				if rxPps < 0 || txPps < 0 {
					rxPps, txPps = 0, 0
				}
				m := SpokeMetric{
					SpokeID: spokeID,
					RXBps:   rxBps,
					TXBps:   txBps,
					RXPps:   rxPps,
					TXPps:   txPps,
				}
				prevStats = stats

				select {
				case metricCh <- m:
				default:
					// If sender is blocked, drop oldest by non-blocking receive then send.
					select {
					case <-metricCh:
					default:
					}
					select {
					case metricCh <- m:
					default:
					}
				}
			}
		}
	}()

	// Connection loop with backoff + jitter; on disconnect reconnect and continue sending.
	backoff := NewBackoff(500*time.Millisecond, 10*time.Second, 1.7)

	for {
		select {
		case <-ctx.Done():
			return ctx.Err()
		default:
		}

		c, err := dialHubWS(ctx, hubWS)
		if err != nil {
			d := backoff.Next()
			log.Printf("spoke: dial failed: %v (retry in %s)", err, d)
			if !sleepCtx(ctx, d) {
				return ctx.Err()
			}
			continue
		}
		backoff.Reset()
		log.Printf("spoke: connected to %s", hubWS)

		// Keepalive ping.
		pingCtx, pingCancel := context.WithCancel(ctx)
		go func() {
			t := time.NewTicker(20 * time.Second)
			defer t.Stop()
			for {
				select {
				case <-pingCtx.Done():
					return
				case <-t.C:
					_ = c.Ping(ctx)
				}
			}
		}()

		// Send loop until error; then reconnect.
		sendErr := sendMetricsLoop(ctx, c, metricCh)
		pingCancel()
		_ = c.Close(websocket.StatusNormalClosure, "reconnect")

		if errors.Is(sendErr, context.Canceled) || errors.Is(sendErr, context.DeadlineExceeded) {
			// context canceled or write timeout - will reconnect unless ctx done
		} else if sendErr != nil {
			log.Printf("spoke: send loop ended: %v", sendErr)
		}

		d := backoff.Next()
		log.Printf("spoke: reconnect in %s", d)
		if !sleepCtx(ctx, d) {
			return ctx.Err()
		}
	}
}

func dialHubWS(ctx context.Context, url string) (*websocket.Conn, error) {
	dialCtx, cancel := context.WithTimeout(ctx, 8*time.Second)
	defer cancel()
	c, _, err := websocket.Dial(dialCtx, url, &websocket.DialOptions{
		HTTPClient: &http.Client{Timeout: 8 * time.Second},
	})
	return c, err
}

func sendMetricsLoop(ctx context.Context, c *websocket.Conn, metricCh <-chan SpokeMetric) error {
	for {
		select {
		case <-ctx.Done():
			return ctx.Err()
		case m, ok := <-metricCh:
			if !ok {
				return context.Canceled
			}
			b, _ := json.Marshal(m)
			writeCtx, cancel := context.WithTimeout(ctx, 2*time.Second)
			err := c.Write(writeCtx, websocket.MessageText, b)
			cancel()
			if err != nil {
				return err
			}
		}
	}
}

type ifaceStats struct {
	rxBytes, txBytes     int64
	rxPackets, txPackets int64
}

func readIfaceStats(iface string) (ifaceStats, error) {
	rx, err := readInt64File(fmt.Sprintf("/sys/class/net/%s/statistics/rx_bytes", iface))
	if err != nil {
		return ifaceStats{}, err
	}
	tx, err := readInt64File(fmt.Sprintf("/sys/class/net/%s/statistics/tx_bytes", iface))
	if err != nil {
		return ifaceStats{}, err
	}
	rxPkts, err := readInt64File(fmt.Sprintf("/sys/class/net/%s/statistics/rx_packets", iface))
	if err != nil {
		return ifaceStats{}, err
	}
	txPkts, err := readInt64File(fmt.Sprintf("/sys/class/net/%s/statistics/tx_packets", iface))
	if err != nil {
		return ifaceStats{}, err
	}
	return ifaceStats{rxBytes: rx, txBytes: tx, rxPackets: rxPkts, txPackets: txPkts}, nil
}

func readInt64File(path string) (int64, error) {
	b, err := os.ReadFile(path)
	if err != nil {
		return 0, err
	}
	s := strings.TrimSpace(string(b))
	if s == "" {
		return 0, errors.New("empty")
	}
	v, err := strconv.ParseInt(s, 10, 64)
	if err != nil {
		return 0, err
	}
	return v, nil
}

//
// ===================== UTIL: BACKOFF =====================
//

type Backoff struct {
	min, max time.Duration
	factor   float64
	cur      time.Duration
}

func NewBackoff(min, max time.Duration, factor float64) *Backoff {
	return &Backoff{min: min, max: max, factor: factor, cur: min}
}

func (b *Backoff) Reset() { b.cur = b.min }

func (b *Backoff) Next() time.Duration {
	// Full jitter: random [0, cur]
	d := time.Duration(rand.Int63n(int64(b.cur) + 1))
	// Increase for next time.
	next := time.Duration(float64(b.cur) * b.factor)
	if next < b.min {
		next = b.min
	}
	if next > b.max {
		next = b.max
	}
	b.cur = next
	if d < 100*time.Millisecond {
		d = 100 * time.Millisecond
	}
	return d
}

func sleepCtx(ctx context.Context, d time.Duration) bool {
	t := time.NewTimer(d)
	defer t.Stop()
	select {
	case <-ctx.Done():
		return false
	case <-t.C:
		return true
	}
}
