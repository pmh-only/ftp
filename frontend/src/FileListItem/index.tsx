import type { RowComponentProps } from 'react-window'
import type { FileModel } from '../model'
import './style.css'
import { File, FileSymlink, Folder, FolderSymlink } from 'lucide-react'

function FileListerItem({
  index,
  items,
  path,
  navigate,
  style
}: RowComponentProps<{
  items: FileModel[],
  path: string,
  navigate: (path: string, linkedFrom?: string, base?: string) => void
}>) {
  const item = items[index]

  return (
    <li style={style} className="flex gap-2 items-center text-nowrap">
      <a
        className="h-full flex gap-1 text-accent hover:text-accent-content hover:underline grow shrink overflow-hidden"
        onClick={(ev) => {
          if (item.type?.includes('FILE'))
            return

          ev.preventDefault()

          if (item.linkedTo !== undefined)
            navigate(item.linkedTo, item.fullPath, path)
          else
            navigate(item.fullPath ?? '')
        }}
        href={item.linkedTo ?? item.fullPath}>

        {item.type === 'FILE' && <File className="w-[1em] h-[1em] shrink-0" />}
        {item.type === 'DIRECTORY' && <Folder className="w-[1em] h-[1em] shrink-0" />}
        {item.type === 'LINK_DIRECTORY' && <FolderSymlink className="w-[1em] h-[1em] shrink-0" />}
        {item.type === 'LINK_FILE' && <FileSymlink className="w-[1em] h-[1em] shrink-0" />}

        <span
          className='overflow-hidden text-ellipsis'
          data-tooltip-id="tooltip"
          data-tooltip-content={"Linked to " + item.linkedTo}
          data-tooltip-hidden={item.linkedTo === undefined}
          data-tooltip-place="right">
          {item.name}
        </span>
      </a>
      {item.bytes !== undefined ? <span>{item.bytesReadable}</span> : <></>}
      <span className="self-end text-xs opacity-70">{item.lastUpdateReadable}</span>
    </li>
  )
}

export default FileListerItem
