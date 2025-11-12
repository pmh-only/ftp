import { useCallback, useEffect, useState } from 'react'
import './style.css'
import type { FileModel } from '../model'
import { ArrowLeft, Folders, TextCursor } from 'lucide-react'
import AutoSizer from 'react-virtualized-auto-sizer'
import { List } from 'react-window'
import FileListerItem from '../FileListItem'

interface Props {
  className?: string
}

function FileLister({ className }: Props) {
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
      const url = (import.meta.env.DEV ? '/api' : '') + path
      const res = await fetch(url, {
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

        try {
          let current = incompleteBody

          if (!incompleteBody.endsWith("\"}]"))
            current += "\"}]"
          else if (!incompleteBody.endsWith("}]"))
            current += "}]"

          const currentJson = JSON.parse(current) as FileModel[]

          if (!Array.isArray(currentJson))
            continue

          setItems(currentJson)
        } catch { }
      }
    }

    listDirectory()

    return () => {
      cancelled = true
    }
  }, [path, forceReload])

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
    <div className={className + " items-start gap-2"}>
      <h1>Index of {path}</h1>
      <div className="flex gap-2 w-full">
        <div
          role="button"
          className="btn btn-accent flex gap-1 h-full aspect-square relative"
          onClick={handleParentClick}>
          <ArrowLeft className="w-[1.4em] h-[1.4em] absolute" />
        </div>
        <div role="alert" className="grow alert alert-soft w-full">
          <p className="flex items-center gap-2">
            <span><b>{items.length}</b> item{items.length === 1 ? '' : 's'} found.</span>
            {linkedFrom.length > 0 ? (
              <>
                Linked from:
                <a
                  className="flex items-center gap-1 text-accent hover:text-accent-content"
                  onClick={(ev) => {
                    ev.preventDefault()
                    navigate(linkedFromParent)
                  }} href={linkedFromParent}>
                  <Folders className="w-[1em] h-[1em]" />
                  {linkedFrom}
                </a>
              </>
            ) : <></>}
          </p>
        </div>
      </div>

      <AutoSizer className="grow">
        {(style) =>
          <List
            rowComponent={FileListerItem}
            rowCount={items.length}
            rowHeight={24}
            style={style}
            className="flex"
            rowProps={{ items, navigate, path }}
          />
        }
      </AutoSizer>
    </div>
  )
}

export default FileLister
