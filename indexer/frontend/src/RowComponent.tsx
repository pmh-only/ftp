import type { RowComponentProps } from "react-window";
import type { FileModel } from "./models";
import { formatBytes } from "./utils";
import { File, FileSymlink, Folder, FolderSymlink } from "lucide-react";

function RowComponent({
  index,
  navigate,
  items,
  style
}: RowComponentProps<{
  items: FileModel[],
  navigate: (path: string, linkedFrom?: string) => void
}>) {
  const item = items[index]

  return (
    <div style={{ ...style, '--i': index } as any} className="item">
      <a
        data-tooltip-id="tooltip"
        data-tooltip-content={"Linked to " + item.linkedTo}
        data-tooltip-hidden={item.linkedTo === undefined}
        data-tooltip-place="right"
        className="fname"
        href={item.fullPath}
        onClick={(ev) => {
          ev.preventDefault()

          if (item.linkedTo !== undefined)
            navigate(item.linkedTo, item.fullPath)
          else
            navigate(item.fullPath)
        }}
      >
        {item.type === 'FILE' && <File className="icon" />}
        {item.type === 'DIRECTORY' && <Folder className="icon" />}
        {item.type === 'LINK_DIRECTORY' && <FolderSymlink className="icon" />}
        {item.type === 'LINK_FILE' && <FileSymlink className="icon" />}

        {item.name}
      </a>

      {item.bytes !== undefined ? <p>{formatBytes(item.bytes)}</p> : <></>}
      <p className="time">{new Date(item.lastUpdate).toLocaleString()}</p>
    </div>
  );
}

export default RowComponent