import { useEffect, useState } from 'react'
import './style.css'
import type { FileModel } from '../model'
import { jsonrepair } from 'jsonrepair'

function App() {
  const url = new URL(window.location.href)

  const [path] = useState<string>(url.pathname)
  const [items, setItems] = useState<FileModel[]>([])

  useEffect(() => {
    let cancelled = false
    document.title = path + ' - ftp.io.kr'

    async function listDirectory() {
      const res = await fetch(path, {
        headers: { 'X-Override-To': 'machine' }
      })

      if (cancelled) return
      if (res.body === null) {
        alert('Directory listing failed.')
        return
      }

      const reader = res.body.getReader()
      let incompleteBody = ''

      for (; ;) {
        const { done, value } = await reader.read()
        if (done) break

        const text = new TextDecoder().decode(value)
        incompleteBody += text

        const currentJson = JSON.parse(jsonrepair(incompleteBody)) as FileModel[]

        setItems(currentJson)
      }
    }

    listDirectory()

    return () => {
      cancelled = true
    }
  }, [path])

  return (
    <div>
      <h1>Index of {window.location.pathname}</h1>
      <p>{items.length} item{items.length === 1 ? '' : 's'} found.</p>

      <p><a href="..">Parent Directory</a></p>

      <ul className="items">
        {items.map((v) =>
          <li key={v.fullPath} className="item">
            <span>{v.type}</span>
            <span><a href={v.linkedTo ?? v.fullPath}>{v.name}</a></span>
            {v.bytes !== undefined ? <span>{v.bytesReadable}</span> : <></>}
            <span>{v.lastUpdateReadable}</span>
          </li>
        )}
      </ul>
    </div>
  )
}

export default App
