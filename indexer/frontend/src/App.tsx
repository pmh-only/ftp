
import './App.css'
import { useEffect, useState } from 'react'
import { List } from 'react-window'
import RowComponent from './RowComponent'
import type { FileModel } from './models'
import { failSafeJSONParse } from './utils'
import AutoSizer from 'react-virtualized-auto-sizer'
import { Folders } from 'lucide-react'


function App() {
  const [items, setItems] = useState<FileModel[]>([])
  const [path, setPath] = useState<string>(window.location.pathname)

  useEffect(() => {
    let cancelled = false

    document.title = path + ' - ftp.io.kr'
    history.pushState({}, "", path)

    async function listDirectory() {
      const url = (import.meta.env.DEV ? 'http://localhost:8080' : '') + path
      const res = await fetch(url, {
        headers: { 'X-Override-For': 'machine' },
        cache: 'no-cache'
      })

      if (cancelled) return
      if (res.body === null) {
        alert('Directory listing failed.')
        return
      }

      const reader = res.body.getReader()
      for (; ;) {
        const { done, value } = await reader.read()
        if (done) break

        const text = new TextDecoder().decode(value)

        for (const object of text.split(/,?\n/)) {
          const objectData = failSafeJSONParse(object)
          if (typeof objectData?.name !== 'string')
            continue

          items.push(objectData)
          setItems([...itemSorter(items)])
        }
      }
    }

    listDirectory()

    return () => {
      cancelled = true
    }
  }, [path])

  function itemSorter(items: FileModel[]): FileModel[] {
    const alphabeticalSorted = items.sort((a, b) =>
      a.name.toLowerCase().localeCompare(b.name.toLowerCase()))

    return [
      ...alphabeticalSorted.filter((v) => v.type.includes('DIRECTORY')),
      ...alphabeticalSorted.filter((v) => !v.type.includes('DIRECTORY')),
    ]
  }

  function navigate(newPath: string) {
    setItems([])
    setPath(newPath)
  }

  return (
    <div className="container">
      <h1>Index of {path}</h1>
      <p>Found {items.length} file(s)</p>
      <a onClick={(e) => {
        e.preventDefault()
        if (path !== '/')
          navigate(path.split('/').slice(0, -2).join('/') + '/')
      }} href="..">
        <Folders className='icon' /> Parent Directory
      </a>
      <div className="content">
        <AutoSizer style={{ height: '100%', width: '100%' }}>
          {(style) =>
            <List
              rowComponent={RowComponent}
              rowCount={items.length}
              rowHeight={25}
              style={style}
              className="items"
              rowProps={{ items, navigate }}
            />
          }
        </AutoSizer>
      </div>
    </div>
  )
}


export default App
