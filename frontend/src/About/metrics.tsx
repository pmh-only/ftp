import { useEffect, useRef, useState } from 'react'
import { humanFileSize } from '../utils'

interface Metric {
  spoke_id: string
  rx_bps: number
  tx_bps: number
  rx_pps: number
  tx_pps: number
}

interface HistoricalData {
  rx: number[]
  tx: number[]
}

interface MetricCardProps {
  label: string
  rxBps: number
  txBps: number
  rxPps: number
  txPps: number
  history: HistoricalData
}

function MetricCard({
  label,
  rxBps,
  txBps,
  rxPps,
  txPps,
  history
}: MetricCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const drawGraph = () => {
      const rect = container.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return

      const dpr = window.devicePixelRatio || 1
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      ctx.scale(dpr, dpr)

      const width = rect.width
      const height = rect.height

      ctx.clearRect(0, 0, width, height)

      const rxData = history.rx
      const txData = history.tx

      if (rxData.length < 2 && txData.length < 2) return

      const maxValue = Math.max(...rxData, ...txData, 1)

      const drawLine = (data: number[], color: string) => {
        if (data.length < 2) return

        ctx.strokeStyle = color
        ctx.lineWidth = 2
        ctx.globalAlpha = 0.5
        ctx.beginPath()

        const padding = 2
        const step = width / Math.max(data.length - 1, 1)
        data.forEach((value, i) => {
          const x = i * step
          const y =
            height - (value / maxValue) * (height - padding * 2) - padding
          if (i === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        })

        ctx.stroke()
        ctx.globalAlpha = 1
      }

      drawLine(rxData, '#60a5fa')
      drawLine(txData, '#34d399')
    }

    drawGraph()

    const resizeObserver = new ResizeObserver(() => {
      drawGraph()
    })

    resizeObserver.observe(container)

    return () => {
      resizeObserver.disconnect()
    }
  }, [history])

  return (
    <div
      ref={containerRef}
      className="relative py-2 bg-base-200 rounded-xl overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
      <div className="relative z-10">
        <div className="text-center text-sm opacity-50">{label}</div>
        <div className="flex flex-wrap justify-around text-sm">
          <div>
            <p>
              rx: <b>{humanFileSize(rxBps)}</b>
            </p>
            <p className="text-xs">{rxPps} packet/s</p>
          </div>
          <div>
            <p>
              tx: <b>{humanFileSize(txBps)}</b>
            </p>
            <p className="text-xs">{txPps} packet/s</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function AboutMetrics() {
  const [metrics, setMetrics] = useState<Metric[]>([])
  const maxHistoryLength = 60
  const [history, setHistory] = useState<Map<string, HistoricalData>>(() => {
    const initialMap = new Map()
    initialMap.set('total', {
      rx: Array(maxHistoryLength).fill(0),
      tx: Array(maxHistoryLength).fill(0)
    })
    return initialMap
  })

  const totalRxBps = Object.values(metrics).reduce(
    (prev, curr) => prev + curr.rx_bps,
    0
  )

  const totalTxBps = Object.values(metrics).reduce(
    (prev, curr) => prev + curr.tx_bps,
    0
  )
  const totalRxPps = Object.values(metrics).reduce(
    (prev, curr) => prev + curr.rx_pps,
    0
  )
  const totalTxPps = Object.values(metrics).reduce(
    (prev, curr) => prev + curr.tx_pps,
    0
  )

  useEffect(() => {
    const sse = new EventSource((import.meta.env.DEV ? '/api' : '') + '/sse')

    sse.addEventListener('metrics', (e) => {
      const newMetrics: Metric[] = Object.values(JSON.parse(e.data))
      setMetrics(newMetrics)

      setHistory((prevHistory) => {
        const newHistory = new Map()

        const totalRx = newMetrics.reduce((sum, m) => sum + m.rx_bps, 0)
        const totalTx = newMetrics.reduce((sum, m) => sum + m.tx_bps, 0)
        const prevTotalData = prevHistory.get('total') || { rx: [], tx: [] }
        const newRxArray = [...prevTotalData.rx, totalRx]
        const newTxArray = [...prevTotalData.tx, totalTx]
        if (newRxArray.length > maxHistoryLength) newRxArray.shift()
        if (newTxArray.length > maxHistoryLength) newTxArray.shift()
        newHistory.set('total', { rx: newRxArray, tx: newTxArray })

        newMetrics.forEach((metric) => {
          const prevData = prevHistory.get(metric.spoke_id) || {
            rx: Array(maxHistoryLength).fill(0),
            tx: Array(maxHistoryLength).fill(0)
          }
          const newRx = [...prevData.rx, metric.rx_bps]
          const newTx = [...prevData.tx, metric.tx_bps]
          if (newRx.length > maxHistoryLength) newRx.shift()
          if (newTx.length > maxHistoryLength) newTx.shift()
          newHistory.set(metric.spoke_id, { rx: newRx, tx: newTx })
        })

        return newHistory
      })
    })

    return () => {
      sse.close()
    }
  }, [])

  return (
    <div className="hidden xl:grid grid-cols-2 gap-2 mt-2">
      <MetricCard
        label="All Nodes"
        rxBps={totalRxBps}
        txBps={totalTxBps}
        rxPps={totalRxPps}
        txPps={totalTxPps}
        history={history.get('total') || { rx: [], tx: [] }}
      />
      {metrics.map((v, i) => (
        <MetricCard
          key={i}
          label={'#' + i + ' ' + v.spoke_id}
          rxBps={v.rx_bps}
          txBps={v.tx_bps}
          rxPps={v.rx_pps}
          txPps={v.tx_pps}
          history={history.get(v.spoke_id) || { rx: [], tx: [] }}
        />
      ))}
    </div>
  )
}

export default AboutMetrics
