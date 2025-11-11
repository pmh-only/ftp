import type { RowComponentProps } from "react-window";
import type { FileModel } from "./models";
import { formatBytes } from "./utils";
import { File, FileSymlink, Folder, FolderSymlink } from "lucide-react";

function RowComponent({
  index,
  items,
  style
}: RowComponentProps<{
  items: FileModel[]
}>) {
  const item = items[index]

  return (
    <div style={style} className="item">
      <a
        data-tooltip-id="linkedto"
        data-tooltip-content={"Symbolic Linked: " + item.linkedTo}
        data-tooltip-place="left"
        href={item.fullPath}>
        {item.type === 'FILE' && <File className="icon" />}
        {item.type === 'DIRECTORY' && <Folder className="icon" />}
        {item.type === 'LINK_DIRECTORY' && <FolderSymlink className="icon" />}
        {item.type === 'LINK_FILE' && <FileSymlink className="icon" />}

        {item.name}
      </a>

      {item.linkedTo !== undefined ? <p>-&gt; {item.linkedTo}</p> : <></>}
      {item.bytes !== undefined ? <p>{formatBytes(item.bytes)}</p> : <></>}
      <p className="time">{new Date(item.lastUpdate).toLocaleString()}</p>
    </div>
  );
}

export default RowComponent