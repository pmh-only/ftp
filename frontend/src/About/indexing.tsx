import { useSetAtom } from 'jotai'
import { pathState, tabState } from '../state'

function AboutIndexing() {
  const setTab = useSetAtom(tabState)
  const setPath = useSetAtom(pathState)

  return (
    <div
      id="indexing"
      className="w-full py-16 flex flex-col gap-8 items-center"
    >
      <h2 className="font-display italic text-4xl font-bold text-center">
        <span className="underline decoration-accent">Indexing,</span>{' '}
        modernized.
      </h2>

      <div className="flex flex-wrap flex-col lg:flex-row px-6 max-w-6xl gap-4 items-stretch">
        <div className="flex-1 flex flex-col items-start p-8">
          <h3 className="text-xl font-bold">Need more Speed?</h3>
          <p>
            ftp.io.kr generates index page after repository syncing. not every
            index page request. this makes indexing faster, more reilable and
            more smooth.
          </p>

          <h3 className="mt-6 text-xl font-bold">DOOMED by DOMs?</h3>
          <p>
            ftp.io.kr provides index page with React and React-Virtualized
            table. which prevents user from crashing when loads very large list
            of files.
          </p>

          <button
            onClick={() => {
              setTab('DIR_EXPLORER')
              setPath('pool/packages/')
            }}
            className="btn btn-accent mt-6 sm:block"
          >
            Let's try large list.
          </button>
        </div>

        <div className="sm:hover-3d grow flex-1 min-w-1/2">
          <video
            className=" rounded-2xl object-cover"
            src="/_assets/indexing.webm"
            loop
            autoPlay
            muted
          />

          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>

      <div className="flex flex-wrap flex-col-reverse lg:flex-row px-6 max-w-6xl gap-4">
        <div className="sm:hover-3d grow flex-1 min-w-1/2">
          <img
            className="w-full rounded-2xl object-cover"
            src="/_assets/lynx.webp"
          />

          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div className="flex-1 flex flex-col p-8">
          <h3 className="text-xl font-bold">Terminal Browsers? no problem.</h3>
          <p>
            ftp.io.kr automatically detects your browsing environment and
            provides all informations as many as possible. lynx? w3m? no
            problem.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap px-6 max-w-6xl gap-4">
        <div className="flex-1 flex flex-col text-right p-8">
          <h3 className="text-xl font-bold">Machine Readable.</h3>
          <p>
            ftp.io.kr supports even JSON output for indexing! Just pass the
            <code className="font-mono px-1 text-secondary bg-base-100 mx-1 rounded select-text selection:bg-secondary-content">
              Accept: application/json
            </code>{' '}
            to request header
          </p>
        </div>
        <div className="sm:hover-3d grow flex-1 min-w-1/2">
          <img
            className="w-full rounded-2xl object-cover"
            src="/_assets/jsonindex.webp"
          />

          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  )
}

export default AboutIndexing
