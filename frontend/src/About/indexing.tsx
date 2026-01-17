import { useSetAtom } from 'jotai'
import { Trans, useTranslation } from 'react-i18next'
import { pathState, tabState } from '../state'

function AboutIndexing() {
  const setTab = useSetAtom(tabState)
  const setPath = useSetAtom(pathState)
  const { t } = useTranslation('indexing')

  return (
    <div
      id="indexing"
      className="w-full mt-16 py-16 flex flex-col gap-16 items-center"
    >
      <h2 className="font-display italic text-4xl px-2 font-bold text-center">
        <span className="underline decoration-accent">{t('title.directoryListing')}</span>{' '}
        {t('title.modernized')}
      </h2>

      <div className="flex flex-col-reverse lg:flex-row sm:px-6 max-w-6xl gap-4 items-stretch">
        <div className="flex-1 flex flex-col items-start p-4 sm:p-8">
          <h3 className="text-xl font-bold">{t('speedSection.title')}</h3>
          <p>
            {t('speedSection.description')}
          </p>

          <h3 className="mt-6 text-xl font-bold">{t('domSection.title')}</h3>
          <p>
            {t('domSection.description')}
          </p>

          <button
            onClick={() => {
              setTab('DIR_EXPLORER')
              setPath('/pool/packages/')
            }}
            className="btn btn-accent mt-6 sm:block"
          >
            {t('domSection.button')}
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

      <div className="flex flex-col lg:flex-row sm:px-6 max-w-6xl gap-4">
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
        <div className="flex-1 flex flex-col  p-4 sm:p-8">
          <h3 className="text-xl font-bold">{t('terminalSection.title')}</h3>
          <p>
            {t('terminalSection.description')}
          </p>

          <h3 className="mt-6 text-xl font-bold">{t('machineSection.title')}</h3>
          <p>
            <Trans i18nKey="machineSection.description" ns="indexing">
              <code className="font-mono px-1 text-secondary bg-base-100 mx-1 rounded select-text selection:bg-secondary-content"></code>
            </Trans>
          </p>
        </div>
      </div>
    </div>
  )
}

export default AboutIndexing
