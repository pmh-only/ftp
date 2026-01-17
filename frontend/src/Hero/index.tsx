import { useAtom } from 'jotai'
import { useTranslation } from 'react-i18next'
import LanguageSelector from '../LanguageSelector'
import { tabState } from '../state'
import './style.css'

interface Props {
  className?: string
}

function Hero({ className }: Props) {
  const [tab, setTab] = useAtom(tabState)
  const { t } = useTranslation(['hero', 'common'])

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
              {t('hero:tagline.aboutMirror')}
            </div>
          )}
          {tab === 'DIR_EXPLORER' && (
            <div className="text-xs self-end bg-accent text-accent-content px-2">
              {t('hero:tagline.fileExplorer')}
            </div>
          )}
        </div>
      </div>

      <div className="hidden md:flex text-xs flex-col gap-6 flex-1 grow overflow-y-auto">
        <div>
          <p>{t('hero:sidebar.the')}</p>
          <p>{t('hero:sidebar.archlinux')}</p>
          <p>{t('hero:sidebar.packageMirror')}</p>
        </div>

        <div>
          <p>{t('hero:sidebar.by')}</p>
          <p>
            <a href="https://github.com/pmh-only" target="_blank">
              {t('hero:sidebar.author')}
            </a>
          </p>
        </div>

        <div>
          <p>{t('hero:sidebar.in')}</p>
          <p>{t('hero:sidebar.location1')}</p>
          <p>{t('hero:sidebar.location2')}</p>
        </div>

        <div>
          <p>{t('hero:sidebar.contact')}</p>
          <p>
            <a href="https://github.com/pmh-only/ftp/issues" target="_blank">
              {t('hero:sidebar.githubIssue')}
            </a>
          </p>
          <p>
            <a href="mailto:pmh_only@pmh.codes" target="_blank">
              {t('hero:sidebar.directEmail')}
            </a>
          </p>
          <p>{t('hero:sidebar.discord')}</p>
        </div>

        <div>
          <p>{t('hero:sidebar.more')}</p>
          <p>
            <a href="https://github.com/pmh-only/ftp" target="_blank">
              {t('hero:sidebar.sourceCode')}
            </a>
          </p>
          <p>
            <a href="https://dash.ftp.io.kr" target="_blank">
              {t('hero:sidebar.dashboard')}
            </a>
          </p>
          <p>
            <a
              href="https://argo.ftp.io.kr/applications/argocd/core-pmhmirror"
              target="_blank"
            >
              {t('hero:sidebar.deployments')}
            </a>
          </p>
          <p>
            <a href="#credit" onClick={() => setTab('ABOUT')}>
              {t('hero:sidebar.legal')}
            </a>
          </p>
        </div>
        <p>
          <LanguageSelector />
        </p>
      </div>

      <div className="flex md:w-full justify-center">
        <div role="tablist" className="tabs tabs-box">
          <button
            role="tab"
            onClick={() => setTab('ABOUT')}
            className={'tab ' + (tab === 'ABOUT' && 'tab-active')}
          >
            {t('common:tabs.about')}
          </button>
          <button
            role="tab"
            onClick={() => setTab('DIR_EXPLORER')}
            className={'tab ' + (tab === 'DIR_EXPLORER' && 'tab-active')}
          >
            {t('common:tabs.files')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Hero
