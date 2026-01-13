package main

type SpokeMetric struct {
	SpokeID string `json:"spoke_id"`
	RXBps   int64  `json:"rx_bps"`
	TXBps   int64  `json:"tx_bps"`
	RXPps   int64  `json:"rx_pps"`
	TXPps   int64  `json:"tx_pps"`
}
