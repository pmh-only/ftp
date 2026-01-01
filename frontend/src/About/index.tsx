import { useSetAtom } from 'jotai'
import { ChevronsDown } from 'lucide-react'
import FileLister from '../FileLister'
import { tabState } from '../state'
import AboutFeatures from './features'

interface Props {
  className?: string
}

function About({ className }: Props) {
  const setTab = useSetAtom(tabState)

  return (
    <div
      className={
        className + ' px-2 overflow-y-auto scroll-smooth snap-y snap-mandatory'
      }
    >
      <div className="w-full h-full flex gap-2 snap-start">
        <div className="flex-1 flex flex-col">
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
              This domain,{' '}
              <a className="font-bold" href="#architecture">
                ftp.io.kr
              </a>{' '}
              provides a fast, reliable package mirror for{' '}
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

          <div className="mockup-code w-full bg-base-300 select-text selection:bg-accent-content overflow-x-auto mt-2">
            <pre data-prefix="" className="text-accent font-bold">
              <code>How to apply:</code>
            </pre>
            <pre data-prefix="$">
              <code>sudo vi /etc/pacman.d/mirrorlist</code>
            </pre>
            <pre data-prefix="1" className="text-info">
              <code>##</code>
            </pre>
            <pre data-prefix="2" className="text-info">
              <code>## Arch Linux repository mirrorlist</code>
            </pre>
            <pre data-prefix="3" className="text-info">
              <code>## Generated on ...</code>
            </pre>
            <pre data-prefix="4" className="text-info">
              <code>##</code>
            </pre>
            <pre data-prefix="5">
              <code></code>
            </pre>
            <pre data-prefix="6" className="text-info">
              <code># prepend one or both</code>
            </pre>
            <pre data-prefix="7">
              <code>
                Server = <b>http://ftp.io.kr/$repo/os/$arch</b>
              </code>
            </pre>
            <pre data-prefix="8">
              <code>
                Server = <b>https://ftp.io.kr/$repo/os/$arch</b>
              </code>
            </pre>
            <pre data-prefix="9">
              <code></code>
            </pre>
          </div>

          <a
            href="#features"
            className="text-center text-sm mt-2 cursor-pointer btn btn-ghost font-normal no-underline flex"
          >
            <ChevronsDown />
            <p className="grow">
              Scroll down to <b>learn more</b>
            </p>
            <ChevronsDown />
          </a>
        </div>

        <FileLister className="flex-1 flex-col lg:flex hidden bg-base-200 p-6 rounded-2xl" />
      </div>

      <AboutFeatures />
      {/* <AboutIndexing /> */}
    </div>
  )
}

export default About
