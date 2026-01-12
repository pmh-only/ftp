import { useSetAtom } from 'jotai'
import { pathState, tabState } from '../state'

function AboutIndexing() {
  const setTab = useSetAtom(tabState)
  const setPath = useSetAtom(pathState)

  return (
    <div
      id="indexing"
      className="w-full mt-16 py-16 flex flex-col gap-8 items-center"
    >
      <h2 className="font-display italic text-4xl font-bold text-center">
        <span className="underline decoration-accent">Directory Listing,</span>{' '}
        modernized.
      </h2>

      <div className="flex flex-col lg:flex-row px-6 max-w-6xl gap-4 items-stretch">
        <div className="flex-1 flex flex-col items-start p-8">
          <h3 className="text-xl font-bold">Need more speed?</h3>
          <p>
            Directory listings on ftp.io.kr are pre-generated during repository
            sync rather than per request, resulting in faster and more reliable
            page loads.
          </p>

          <h3 className="mt-6 text-xl font-bold">Too many DOM nodes?</h3>
          <p>
            ftp.io.kr uses React with list virtualization to efficiently render
            large directories without overwhelming the browser.
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

      <div className="flex flex-col-reverse lg:flex-row px-6 max-w-6xl gap-4">
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
          <h3 className="text-xl font-bold">Terminal browsers? No problem.</h3>
          <p>
            ftp.io.kr automatically detects your browsing environment and
            provides as much relevant information as possible. Terminal browsers
            such as lynx and w3m are fully supported.
          </p>

          <h3 className="mt-6 text-xl font-bold">Machine Readable.</h3>
          <p>
            ftp.io.kr supports JSON output for indexing. Add
            <code className="font-mono px-1 text-secondary bg-base-100 mx-1 rounded select-text selection:bg-secondary-content">
              Accept: application/json
            </code>
            to the request header, which is what the React frontend uses.
          </p>
        </div>
      </div>
    </div>
  )
}

export default AboutIndexing
