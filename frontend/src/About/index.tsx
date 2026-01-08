import { useSetAtom } from 'jotai'
import { ChevronsDown } from 'lucide-react'
import { useEffect, useState } from 'react'
import FileLister from '../FileLister'
import { tabState } from '../state'
import { getRelative } from '../utils'
import AboutFeatures from './features'
import AboutIndexing from './indexing'

interface Props {
  className?: string
}

function About({ className }: Props) {
  const setTab = useSetAtom(tabState)
  const [updateData, setUpdateData] = useState({
    lastSync: Date.now(),
    lastUpdate: Date.now()
  })

  const [lastSync] = getRelative(updateData.lastSync)
  const [lastUpdate] = getRelative(updateData.lastUpdate)

  useEffect(() => {
    ;(async () => {
      const lastSync = await fetch(
        (import.meta.env.DEV ? '/api' : '') + '/lastsync'
      ).then((res) => res.text())

      const lastUpdate = await fetch(
        (import.meta.env.DEV ? '/api' : '') + '/lastupdate'
      ).then((res) => res.text())

      setUpdateData({
        lastSync: parseInt(lastSync) * 1000,
        lastUpdate: parseInt(lastUpdate) * 1000
      })
    })()
  }, [])

  return (
    <div className={className + ' pr-2 overflow-y-auto scroll-smooth'}>
      <div className="w-full h-full flex gap-2">
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

              <button
                onClick={() => setTab('DIR_EXPLORER')}
                className="btn hidden sm:block"
              >
                Browse Files
              </button>
            </div>
          </div>

          <div className="mockup-code w-full bg-base-300 select-text selection:bg-accent-content mt-2 hidden sm:block">
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

        <div className="flex-1 lg:flex hidden flex-col">
          <FileLister className="flex-1 flex-col lg:flex hidden bg-base-200 p-6 rounded-2xl" />

          <div className="mt-2 flex text-sm gap-2">
            <p className="flex-1 font-light text-center bg-base-300 p-2 rounded-lg">
              Last sync: <b className="font-semibold">{lastSync}</b>
            </p>
            <p className="flex-1 font-light text-center bg-base-300 p-2 rounded-lg">
              Last update: <b className="font-semibold">{lastUpdate}</b>
            </p>
          </div>
        </div>
      </div>

      <AboutFeatures />
      <AboutIndexing />
    </div>
  )
}

export default About
