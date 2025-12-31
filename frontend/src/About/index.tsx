import { useSetAtom } from 'jotai'
import { tabState } from '../state'

interface Props {
  className?: string
}

function About({ className }: Props) {
  const setTab = useSetAtom(tabState)

  return (
    <div className={className}>
      <div className="w-full h-full flex flex-col">
        <div
          className="text-sm grow flex flex-col justify-end p-6 bg-center bg-cover rounded-2xl"
          style={{ backgroundImage: 'url(/_assets/aboutbg.webp)' }}
        >
          <h2 className="text-2xl font-bold">
            <div>
              The{' '}
              <span className="text-rotate">
                <span>
                  <span>Shining bright</span>
                  <span>Performance-ready</span>
                  <span>Highly available</span>
                  <span>Privacy-first</span>
                  <span>Fully transparent</span>
                </span>
              </span>
            </div>
            <div>Mirror for Arch Linux</div>
          </h2>

          <p className="mt-3 max-w-lg">
            This server <a href="#">ftp.io.kr</a> provides a fast, reliable
            package mirror for{' '}
            <a href="https://archlinux.org/" target="_blank">
              Arch Linux
            </a>
            , a lightweight and flexible Linux® distribution that follows the
            “Keep It Simple” philosophy.
          </p>

          <div className="flex gap-2 mt-3">
            <a
              download
              href="/iso/latest/archlinux-x86_64.iso"
              className="btn btn-accent"
            >
              Download Latest .iso
            </a>

            <button onClick={() => setTab('DIR_EXPLORER')} className="btn">
              Browse Files
            </button>
          </div>
        </div>

        <a
          href="#why"
          className="text-center text-sm mt-2 cursor-pointer btn font-normal no-underline"
        >
          ... scroll me down to <span className="font-bold">learn more</span>{' '}
          ...
        </a>
      </div>

      <h2 id="why" className="text-2xl font-bold mt-6">
        <span className="underline decoration-accent">Why</span> you should use
        ftp.io.kr?
      </h2>
      <p className="h-full"></p>
    </div>
  )
}

export default About
