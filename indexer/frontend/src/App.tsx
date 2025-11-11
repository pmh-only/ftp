
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

  useEffect(() => {
    let cancelled = false

    document.title = window.location.pathname + ' - ftp.io.kr'

    async function listDirectory() {
      const res = await fetch(window.location.pathname, {
        headers: { 'X-Override-For': 'machine' }
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
  }, [])

  function itemSorter(items: FileModel[]): FileModel[] {
    const alphabeticalSorted = items.sort((a, b) =>
      a.name.toLowerCase().localeCompare(b.name.toLowerCase()))

    return [
      ...alphabeticalSorted.filter((v) => v.type === 'DIRECTORY'),
      ...alphabeticalSorted.filter((v) => v.type !== 'DIRECTORY'),
    ]
  }

  return (
    <div className="container">
      <h1>Index of {window.location.pathname}</h1>
      <p>Found {items.length} file(s)</p>
      <a href=".."><Folders className='icon' /> Parent Directory</a>
      <div className="content">
        <AutoSizer style={{ height: '100%', width: '100%' }}>
          {(style) =>
            <List
              rowComponent={RowComponent}
              rowCount={items.length}
              rowHeight={25}
              style={style}
              className="items"
              rowProps={{ items }}
            />
          }
        </AutoSizer>
      </div>
    </div>
  )
}


export default App
