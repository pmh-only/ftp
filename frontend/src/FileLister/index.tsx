import { useAtom } from 'jotai'
import {
  ArrowLeft,
  ArrowRight,
  Folders,
  Home,
  LucideFolderSearch2
} from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'
import { List } from 'react-window'
import FileListerItem from '../FileListItem'
import { tryParse, type FileModel } from '../model'
import { pathState } from '../state'
import './style.css'

interface Props {
  className?: string
}

function FileLister({ className }: Props) {
  const [items, setItems] = useState<FileModel | undefined>()
  const [path, setPath] = useAtom(pathState)
  const [linkedFrom, setLinkedFrom] = useState<string>('')
  const [linkedFromParent, setLinkedFromParent] = useState<string>('')
  const [forceReload, setForceReload] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const handlePopState = () => {
      const url = new URL(window.location.href)
      const state = window.history.state || {}

      setItems(undefined)
      setPath(url.pathname)
      setLinkedFrom(state.linkedFrom ?? '')
      setLinkedFromParent(state.linkedFromParent ?? '')
      setForceReload((prev) => prev + 1)
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [setPath])

  useEffect(() => {
    let cancelled = false
    document.title = path + ' - ftp.io.kr.'

    async function listDirectory() {
      setLoading(true)
      const url = (import.meta.env.DEV ? '/api' : '') + path
      const res = await fetch(url, {
        headers: {
          'X-Override-To': 'machine',
          Accept: 'application/json'
        }
      })

      if (cancelled) return
      if (res.body === null) {
        alert('Directory listing failed.')
        return
      }

      const reader = res.body.getReader()
      let incompleteBody = ''

      for (;;) {
        const { done, value } = await reader.read()
        if (cancelled) return

        if (done) {
          setItems(JSON.parse(incompleteBody) as FileModel)
          break
        }

        const text = new TextDecoder().decode(value)
        incompleteBody += text

        const parsed = tryParse(incompleteBody)
        if (parsed !== undefined) setItems(parsed)
      }

      setLoading(false)
    }

    listDirectory()

    return () => {
      cancelled = true
    }
  }, [path, forceReload])

  const navigate = useCallback(
    (newPath: string, symlinkFullPath = '', symlinkParent = '') => {
      const isPathChanged = path !== newPath

      setItems(undefined)
      setPath(newPath)
      setLinkedFrom(symlinkFullPath)
      setLinkedFromParent(symlinkParent)

      if (!isPathChanged) setForceReload((prev) => prev + 1)

      window.history.pushState(
        {
          linkedFromParent: symlinkParent,
          linkedFrom: symlinkFullPath,
          isPathChanged: isPathChanged
        },
        '',
        newPath
      )
    },
    [setPath, path]
  )

  const handleParentClick = useCallback(
    (ev: React.MouseEvent) => {
      ev.preventDefault()
      if (path !== '/') navigate(path.split('/').slice(0, -2).join('/') + '/')
    },
    [path, navigate]
  )

  return (
    <div className={className + ' gap-2'}>
      <div className="flex w-full join">
        <button
          disabled={path === '/'}
          className="btn btn-accent flex gap-1 h-full aspect-square relative join-item"
          onClick={handleParentClick}
        >
          {path === '/' && (
            <ArrowRight className="w-[1.4em] h-[1.4em] absolute" />
          )}
          {path !== '/' && (
            <ArrowLeft className="w-[1.4em] h-[1.4em] absolute" />
          )}
        </button>
        <div
          role="alert"
          className="grow alert alert-soft w-full flex gap-2 join-item"
        >
          <div className="inline-grid *:[grid-area:1/1]">
            {loading && (
              <div className="status status-error animate-ping"></div>
            )}
            {loading && <div className="status status-error"></div>}
            {!loading && (
              <div className="status status-success animate-ping"></div>
            )}
            {!loading && <div className="status status-success "></div>}
          </div>
          <p className="grow flex-1">
            <b>{items?.directChildren?.length ?? 0}</b> item
            {items?.directChildren?.length === 1 ? '' : 's'} (
            {items?.bytesReadable ?? '0 Bytes'}) found!
          </p>
          {linkedFrom.length > 0 ? (
            <p className="gap-2 hidden sm:flex">
              Redirected from:
              <a
                className="flex items-center gap-1"
                onClick={(ev) => {
                  ev.preventDefault()
                  navigate(linkedFromParent)
                }}
                href={linkedFromParent}
              >
                <Folders className="w-[1em] h-[1em]" />
                {linkedFrom}
              </a>
            </p>
          ) : (
            <></>
          )}
        </div>
      </div>

      {!loading && (items?.directChildren?.length ?? 0) < 1 && (
        <div className="text-center text-sm text-light py-5 flex flex-col items-center justify-center grow">
          <p className="text-2xl">
            <LucideFolderSearch2 className="w-[1em] h-[1em]" />
          </p>
          <p>hmm... seems empty</p>
        </div>
      )}

      <AutoSizer
        className={
          'grow ' +
          (!loading && (items?.directChildren?.length ?? 0) < 1 ? 'hidden' : '')
        }
      >
        {(style) =>
          items?.directChildren && (
            <List
              tagName="ul"
              rowComponent={FileListerItem}
              rowCount={items.directChildren.length}
              rowHeight={24}
              style={style}
              className="flex"
              rowProps={{ items, navigate, path }}
            />
          )
        }
      </AutoSizer>

      <div className="flex w-full text-sm">
        <div className="breadcrumbs p-0 flex-1 grow">
          <ul>
            <li>
              <a
                onClick={(ev) => {
                  ev.preventDefault()
                  navigate('/')
                }}
                href="/"
              >
                <Home className="w-[1em] h-5" />
              </a>
            </li>
            {path
              .split('/')
              .filter((v) => v.length > 0)
              .concat('')
              .map((v, i, a) => (
                <li key={i}>
                  <a
                    onClick={(ev) => {
                      ev.preventDefault()
                      navigate(`/${a.slice(0, i + 1).join('/')}/`)
                    }}
                    href={`/${a.slice(0, i + 1).join('/')}/`}
                  >
                    {v}
                  </a>
                </li>
              ))}
          </ul>
        </div>
        <p className="text-sm hidden sm:block">
          <a href="//youtu.be/sgNkCrAhTGc" target="_blank">
            with love.
          </a>
        </p>
      </div>
    </div>
  )
}

export default FileLister
