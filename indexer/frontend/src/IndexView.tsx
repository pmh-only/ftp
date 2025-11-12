import './IndexView.css'
import { useEffect, useState, useMemo, useCallback } from 'react'
import type { FileModel } from './models'
import { failSafeJSONParse, formatBytes } from './utils'
import { Folders } from 'lucide-react'
import { File, FileSymlink, Folder, FolderSymlink } from "lucide-react";

function IndexView() {
  const url = new URL(window.location.href)

  const [items, setItems] = useState<FileModel[]>([])
  const [path, setPath] = useState<string>(url.pathname)
  const [linkedFrom, setLinkedFrom] = useState<string>('')
  const [linkedFromParent, setLinkedFromParent] = useState<string>('')
  const [forceReload, setForceReload] = useState<number>(0)

  useEffect(() => {
    const handlePopState = () => {
      const url = new URL(window.location.href)
      const state = window.history.state || {}

      setItems([])
      setPath(url.pathname)
      setLinkedFrom(state.linkedFrom ?? '')
      setLinkedFromParent(state.linkedFromParent ?? '')
      setForceReload(prev => prev + 1)
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

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
      const tempItems: FileModel[] = []
      const BATCH_SIZE = 100

      for (; ;) {
        const { done, value } = await reader.read()
        if (done) break

        const text = new TextDecoder().decode(value)

        for (const object of text.split(/,?\n/)) {
          const objectData = failSafeJSONParse(object)
          if (typeof objectData?.name !== 'string')
            continue

          tempItems.push(objectData)

          if (tempItems.length % BATCH_SIZE === 0) {
            setItems([...tempItems])
          }
        }
      }

      if (!cancelled) {
        setItems([...tempItems])
      }
    }

    listDirectory()

    return () => {
      cancelled = true
    }
  }, [path, forceReload])

  const sortedItems = useMemo(() => {
    const alphabeticalSorted = [...items].sort((a, b) =>
      a.name.toLowerCase().localeCompare(b.name.toLowerCase()))

    return [
      ...alphabeticalSorted.filter((v) => v.type.includes('DIRECTORY')),
      ...alphabeticalSorted.filter((v) => !v.type.includes('DIRECTORY')),
    ]
  }, [items])

  const navigate = useCallback((newPath: string, symlinkFullPath = '', symlinkParent = '') => {
    const isPathChanged = path !== newPath

    setItems([])
    setPath(newPath)
    setLinkedFrom(symlinkFullPath)
    setLinkedFromParent(symlinkParent)

    if (!isPathChanged)
      setForceReload(prev => prev + 1)

    window.history.pushState({
      linkedFromParent: symlinkParent,
      linkedFrom: symlinkFullPath,
      isPathChanged: isPathChanged
    }, "", newPath)
  }, [path])

  const handleParentClick = useCallback((ev: React.MouseEvent) => {
    ev.preventDefault()
    if (path !== '/')
      navigate(path.split('/').slice(0, -2).join('/') + '/')
  }, [path, navigate])

  return (
    <div className="index_view">
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
                navigate(linkedFromParent)
              }} href={linkedFromParent}>
                &#32;{linkedFrom}
              </a>
            </>
          ) : <></>}
        </p>
      </div>
      <a className="parent" onClick={handleParentClick} href="..">
        <Folders className="icon" />
        <p>Parent Directory</p>
      </a>
      <ul className="items">
        {sortedItems.map((item, i) => (
          <li key={i}>
            <a
              className="item"
              onClick={(ev) => {
                if (item.type.includes('FILE'))
                  return

                ev.preventDefault()

                if (item.linkedTo !== undefined)
                  navigate(item.linkedTo, item.fullPath, path)
                else
                  navigate(item.fullPath)
              }}
              href={item.fullPath}>

              {item.type === 'FILE' && <File className="icon" />}
              {item.type === 'DIRECTORY' && <Folder className="icon" />}
              {item.type === 'LINK_DIRECTORY' && <FolderSymlink className="icon" />}
              {item.type === 'LINK_FILE' && <FileSymlink className="icon" />}

              <span
                data-tooltip-id="tooltip"
                data-tooltip-content={"Linked to " + item.linkedTo}
                data-tooltip-hidden={item.linkedTo === undefined}
                data-tooltip-place="right"
                className="fname">{item.name}</span>

              <span className="size">{item.bytes !== undefined && formatBytes(item.bytes)}</span>
              <span className="last">{new Date(item.lastUpdate).toLocaleString()}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default IndexView