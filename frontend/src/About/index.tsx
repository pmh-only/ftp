import { useSetAtom } from 'jotai'
import { ChevronsDown } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import FileLister from '../FileLister'
import { tabState } from '../state'
import { getRelative } from '../utils'
import AboutArchitecture from './architecture'
import AboutCredit from './credit'
import AboutFeatures from './features'
import AboutIndexing from './indexing'
import AboutMetrics from './metrics'
import AboutQnA from './qna'

interface Props {
  className?: string
}

function About({ className }: Props) {
  const setTab = useSetAtom(tabState)
  const { t } = useTranslation(['about', 'common'])
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
    <div className={className + ' pr-4 sm:pr-2 overflow-y-auto scroll-smooth'}>
      <div className="w-full h-full flex gap-2">
        <div className="flex-1 flex flex-col">
          <div
            className="text-sm grow flex flex-col justify-end p-6 bg-center bg-cover rounded-2xl"
            style={{ backgroundImage: 'url(/_assets/aboutbg.webp)' }}
          >
            <h2 className="text-2xl font-bold">
              <div>
                {t('about:hero.the')}{' '}
                <span className="text-rotate">
                  <span>
                    <span>{t('about:hero.qualities.brightlyShining')}</span>
                    <span>{t('about:hero.qualities.performanceReady')}</span>
                    <span>{t('about:hero.qualities.highlyAvailable')}</span>
                    <span>{t('about:hero.qualities.privacyFirst')}</span>
                    <span>{t('about:hero.qualities.fullyTransparent')}</span>
                  </span>
                </span>
              </div>
              <div>{t('about:hero.mirrorForArchLinux')}</div>
            </h2>

            <p className="mt-3 max-w-lg">
              {t('about:hero.description.part1')}{' '}
              <a className="font-bold" href="#architecture">
                ftp.io.kr
              </a>{' '}
              {t('about:hero.description.part2')}{' '}
              <a href="https://archlinux.org/" target="_blank">
                Arch Linux
              </a>
              {t('about:hero.description.part3')}
            </p>

            <div className="flex gap-2 mt-3">
              <a
                download
                href="/iso/latest/archlinux-x86_64.iso"
                className="btn btn-accent"
              >
                {t('common:buttons.downloadIso')}
              </a>

              <button
                onClick={() => setTab('DIR_EXPLORER')}
                className="btn hidden sm:block"
              >
                {t('common:buttons.browseFiles')}
              </button>
            </div>
          </div>

          <div className="mockup-code w-full bg-base-300 select-text selection:bg-accent-content mt-2 hidden sm:block">
            <pre data-prefix="" className="text-accent font-bold">
              <code>{t('about:howToApply.title')}</code>
            </pre>
            <pre data-prefix="$">
              <code>sudo vi /etc/pacman.d/mirrorlist</code>
            </pre>
            <pre data-prefix="1" className="text-info">
              <code>{t('about:howToApply.comment1')}</code>
            </pre>
            <pre data-prefix="2" className="text-info">
              <code>{t('about:howToApply.comment2')}</code>
            </pre>
            <pre data-prefix="3" className="text-info">
              <code>{t('about:howToApply.comment3')}</code>
            </pre>
            <pre data-prefix="4" className="text-info">
              <code>{t('about:howToApply.comment4')}</code>
            </pre>
            <pre data-prefix="5">
              <code></code>
            </pre>
            <pre data-prefix="6" className="text-info">
              <code>{t('about:howToApply.comment5')}</code>
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
              {t('about:scrollDown.text')} <b>{t('about:scrollDown.learnMore')}</b>
            </p>
            <ChevronsDown />
          </a>
        </div>

        <div className="flex-1 lg:flex hidden flex-col">
          <FileLister className="flex-1 flex-col lg:flex hidden bg-base-200 p-6 rounded-2xl" />

          <AboutMetrics />

          <div className="mt-2 flex text-sm gap-2">
            <p className="flex-1 font-light text-center bg-base-300 p-2 rounded-lg">
              {t('about:metrics.lastSync')} <b className="font-semibold">{lastSync}</b>
            </p>
            <p className="flex-1 font-light text-center bg-base-300 p-2 rounded-lg">
              {t('about:metrics.lastUpdate')} <b className="font-semibold">{lastUpdate}</b>
            </p>
          </div>
        </div>
      </div>

      <AboutFeatures />
      <AboutIndexing />
      <AboutArchitecture />
      <AboutQnA />
      <AboutCredit />
    </div>
  )
}

export default About
