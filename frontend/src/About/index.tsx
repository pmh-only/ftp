import { useSetAtom } from 'jotai'
import { useEffect } from 'react'
import { tabState } from '../state'

interface Props {
  className?: string
}

function About({ className }: Props) {
  const setTab = useSetAtom(tabState)
  useEffect(() => {
    document.title = 'about - ftp.io.kr.'
  })

  return (
    <div className={className + ' overflow-y-auto p-2 flex gap-6'}>
      <div className="flex flex-col-reverse lg:flex-row gap-6">
        <div className="grow flex-1 bg-base-300 rounded-2xl p-6 text-sm font-light flex flex-col justify-end gap-3 items-start">
          <div className="max-w-lg">
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
            <p>
              This server <a href="#">ftp.io.kr</a> provides a fast, reliable
              package mirror for{' '}
              <a href="https://archlinux.org/" target="_blank">
                Arch Linux
              </a>
              , a lightweight and flexible Linux® distribution that follows the
              “Keep It Simple” philosophy.
            </p>
            <p></p>
          </div>

          <div className="flex gap-2">
            <a
              download
              href="/iso/latest/archlinux-x86_64.iso"
              className="btn btn-accent"
            >
              Download Latest .iso
            </a>

            <button
              onClick={() => setTab('DIR_EXPLORER')}
              className="btn btn-soft btn-accent"
            >
              Browse Files
            </button>
          </div>
        </div>

        <div
          className="grow flex-1 hero bg-base-300 rounded-2xl lg:max-w-xl"
          style={{ backgroundImage: 'url(/_assets/aboutbg.webp)' }}
        >
          <div className="flex flex-col justify-end items-start p-6 pb-8 w-full h-64 gap-2 italic">
            <h1 className="font-bold italic font-display text-6xl">
              <span className="font-thin">ftp</span>.io.kr.
            </h1>
          </div>
        </div>
      </div>

      <div className="flex flex-col-reverse lg:flex-row gap-6">
        <div className="grow flex-1 hero bg-base-300 rounded-2xl lg:max-w-xl">
          <div className="mockup-code w-full h-full select-text selection:bg-accent-content">
            <pre data-prefix=">" className="text-accent">
              <code>
                You can use this mirror by modifying your mirrorlist file.
              </code>
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
            <pre data-prefix="6">
              <code>
                Server = http://ftp.io.kr/<b>$repo/os/$arch</b>
              </code>{' '}
              <code className="text-info"># or..</code>
            </pre>
            <pre data-prefix="7">
              <code>
                Server = https://ftp.io.kr/<b>$repo/os/$arch</b>
              </code>
            </pre>
            <pre data-prefix="8">
              <code></code>
            </pre>
          </div>
        </div>

        <div className="grow flex-1 bg-base-300 rounded-2xl p-6 text-sm font-light flex flex-col justify-center gap-3 items-center">
          <div className="stats">
            <div className="stat place-items-center">
              <div className="stat-title">Downloads</div>
              <div className="stat-value">31K</div>
              <div className="stat-desc">From January 1st to February 1st</div>
            </div>

            <div className="stat place-items-center">
              <div className="stat-title">Users</div>
              <div className="stat-value text-secondary">4,200</div>
              <div className="stat-desc text-secondary">↗︎ 40 (2%)</div>
            </div>

            <div className="stat place-items-center">
              <div className="stat-title">New Registers</div>
              <div className="stat-value">1,200</div>
              <div className="stat-desc">↘︎ 90 (14%)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
