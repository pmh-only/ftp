import { useEffect, useState } from 'react'
import './style.css'
import type { FileModel } from '../model'
import { formatBytes } from '../utils'

function App() {
  const url = new URL(window.location.href)

  const [path] = useState<string>(url.pathname)
  const [items, setItems] = useState<FileModel[]>([])

  useEffect(() => {
    let cancelled = false
    document.title = path + ' - ftp.io.kr'

    async function listDirectory() {
      const res = await fetch(path, {
        headers: { 'X-Override-To': 'machine' },
        cache: 'no-cache'
      })

      if (cancelled) return
      setItems(await res.json())
    }

    listDirectory()

    return () => {
      cancelled = true
    }
  }, [path])

  return (
    <div>
      <p>Index of {window.location.pathname}</p>
      <p>{items.length} item{items.length === 1 ? '' : 's'} found.</p>

      <a href="..">Parent Directory</a>

      <ul>
        {items.map((v) =>
          <li key={v.fullPath}>
            <span>{v.type}</span>
            <span><a href={v.linkedTo ?? v.fullPath}>{v.name}</a></span>
            {v.bytes !== undefined ? <span>{formatBytes(v.bytes)}</span> : <></>}
            <span>{new Date(v.lastUpdate).toLocaleString()}</span>
          </li>
        )}
      </ul>
    </div>
  )
}

export default App
