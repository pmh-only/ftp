import { useAtom } from 'jotai'
import { tabState } from '../state'
import './style.css'

interface Props {
  className?: string
}

function Hero({ className }: Props) {
  const [tab, setTab] = useAtom(tabState)

  return (
    <div
      className={
        className +
        ' flex items-end md:items-start md:flex-col pr-6 w-full md:w-auto md:min-h-full gap-4'
      }
    >
      <div className="grow md:grow-0">
        <div className="flex flex-col w-fit leading-none">
          <h1 className="font-bold italic font-display text-4xl">
            <span className="font-thin">ftp</span>.io.kr.
          </h1>
          {tab === 'ABOUT' && (
            <div className="text-xs self-end bg-accent text-accent-content px-2">
              about mirror
            </div>
          )}
          {tab === 'DIR_EXPLORER' && (
            <div className="text-xs self-end bg-accent text-accent-content px-2">
              file explorer
            </div>
          )}
        </div>
      </div>

      <div className="hidden md:flex text-xs flex-col gap-6 flex-1 grow overflow-y-auto">
        <div>
          <p>The</p>
          <p>Archlinux</p>
          <p>package mirror.</p>
        </div>

        <div>
          <p>In</p>
          <p>Chuncheon-si,</p>
          <p>Republic of Korea.</p>
        </div>

        <div>
          <p>Contact</p>
          <p>
            <a href="https://github.com/pmh-only/ftp/issues" target="_blank">
              GitHub issue tracker.
            </a>
          </p>
          <p>
            <a href="mailto:pmh_only@pmh.codes" target="_blank">
              Direct email.
            </a>
          </p>
          <p>Discord (@pmh_only)</p>
        </div>

        <div>
          <p>More?</p>
          <p>
            <a href="https://github.com/pmh-only/ftp" target="_blank">
              Source Code for Infra.
            </a>
          </p>
          <p>
            <a href="https://dash.ftp.io.kr" target="_blank">
              Monitoring Dashboard.
            </a>
          </p>
          <p>
            <a
              href="https://argo.ftp.io.kr/applications/argocd/core-pmhmirror"
              target="_blank"
            >
              Cont. Deployments.
            </a>
          </p>
        </div>

        <div>
          <p>&copy; 2025-{new Date().getFullYear()}.</p>
          <p>
            <a href="https://github.com/pmh-only" target="_blank">
              Minhyeok Park.
            </a>
          </p>
        </div>
      </div>

      <div className="flex md:w-full justify-center">
        <div role="tablist" className="tabs tabs-box">
          <button
            role="tab"
            onClick={() => setTab('ABOUT')}
            className={'tab ' + (tab === 'ABOUT' && 'tab-active')}
          >
            About
          </button>
          <button
            role="tab"
            onClick={() => setTab('DIR_EXPLORER')}
            className={'tab ' + (tab === 'DIR_EXPLORER' && 'tab-active')}
          >
            Files
          </button>
        </div>
      </div>
    </div>
  )
}

export default Hero
