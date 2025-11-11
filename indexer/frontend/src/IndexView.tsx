
import './IndexView.css'
import { createRef, useEffect, useState } from 'react'
import { List } from 'react-window'
import RowComponent from './RowComponent'
import type { FileModel } from './models'
import { failSafeJSONParse } from './utils'
import AutoSizer from 'react-virtualized-auto-sizer'
import { Folders } from 'lucide-react'

function IndexView() {
  const url = new URL(window.location.href)

  const listRef = createRef<{ element: HTMLDivElement }>()
  const [items, setItems] = useState<FileModel[]>([])
  const [path, setPath] = useState<string>(url.pathname)
  const [linkedFrom, setLinkedFrom] = useState<string>('')
  const [linkedFromParent, setLinkedFromParent] = useState<string>('')

  useEffect(() => {
    window.addEventListener('popstate', () => {
      const url = new URL(window.location.href)

      if (window.history.state?.isPathChanged ?? false)
        setItems([])

      setPath(url.pathname)
      setLinkedFrom(window.history.state?.linkedFrom ?? '')
      setLinkedFromParent(window.history.state?.linkedFromParent ?? '')
    })
  }, [])

  useEffect(() => {
    listRef.current?.element?.addEventListener('scroll', () => {
      if ((listRef.current?.element?.scrollTop ?? 0) > 0)
        listRef.current?.element.classList.add('scrolled')
      else
        listRef.current?.element.classList.remove('scrolled')
    })
  }, [listRef])

  useEffect(() => {
    let cancelled = false
    document.title = path + ' - ftp.io.kr'

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

  function navigate(newPath: string, newLinkedFrom = '') {
    if (path !== newPath)
      setItems([])

    setPath(newPath)
    setLinkedFrom(newLinkedFrom)

    window.history.pushState({ linkedFromParent: path, linkedFrom: newLinkedFrom, isPathChanged: path !== newPath }, "", newPath)
  }

  return (
    <div className="container">
      <h1>Index of {path}</h1>
      <div className="desc">
        <p>
          Found {items.length} item{items.length !== 1 ? 's' : ''}.
          {linkedFrom.length > 0 ? (
            <>
              &#32;
              Linked from:
              <a onClick={(ev) => {
                ev.preventDefault()
                window.history.back()
              }} href={linkedFromParent}>
                &#32;{linkedFrom}
              </a>
            </>
          ) : <></>}
        </p>
      </div>
      <a className="parent" onClick={(ev) => {
        ev.preventDefault()
        if (path !== '/')
          navigate(path.split('/').slice(0, -2).join('/') + '/')
      }} href="..">
        <Folders className="icon" />Parent Directory
      </a>
      <div className="content">
        <AutoSizer style={{ height: '100%', width: '100%' }}>
          {(style) =>
            <List
              listRef={listRef as any}
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

export default IndexView
