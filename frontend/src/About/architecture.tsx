import { BookText, FolderSync, Globe } from 'lucide-react'
import { Trans, useTranslation } from 'react-i18next'

function AboutArchitecture() {
  const { t } = useTranslation(['architecture', 'common'])

  return (
    <div
      id="architecture"
      className="w-full mt-16 flex justify-center flex-col py-6 min-h-full"
    >
      <div className="flex flex-col gap-8">
        <h2 className="font-display italic text-4xl font-bold text-center">
          {t('title.reliable')}{' '}
          <span className="underline decoration-accent">{t('title.architectures')}</span>.
        </h2>

        <div className="flex flex-col items-center gap-6">
          <img
            src="/_assets/architecture.webp"
            className="hidden lg:block w-full max-w-3xl px-2 object-contain"
          />
          <img
            src="/_assets/architecture_single.webp"
            className="block lg:hidden w-full px-2 object-contain"
          />

          <section className="flex gap-6 flex-wrap justify-center">
            <div className="card w-full lg:w-82 shadow-sm">
              <div className="card-body bg-base-200 rounded-xl">
                <h2 className="card-title flex justify-between items-end">
                  <span>{t('cards.indexer.title')}</span>
                  <span className="text-5xl opacity-25">
                    <BookText className="w-[1em] h-[1em]" />
                  </span>
                </h2>
                <p>
                  {t('cards.indexer.description1')}
                </p>
                <p>
                  <Trans i18nKey="cards.indexer.description2" ns="architecture">
                    <code></code>
                    <code></code>
                  </Trans>
                </p>
                <div className="card-actions justify-end">
                  <a
                    href="https://github.com/pmh-only/ftp/tree/main/indexer"
                    target="_blank"
                    className="btn btn-accent"
                  >
                    {t('common:buttons.showSource')}
                  </a>
                </div>
              </div>
            </div>
            <div className="card w-full lg:w-82 shadow-sm">
              <div className="card-body bg-base-200 rounded-xl">
                <h2 className="card-title flex justify-between items-end">
                  <span>{t('cards.webServer.title')}</span>
                  <span className="text-5xl opacity-25">
                    <Globe className="w-[1em] h-[1em]" />
                  </span>
                </h2>
                <p>
                  <Trans i18nKey="cards.webServer.description1" ns="architecture">
                    <strong></strong>
                  </Trans>
                </p>
                <p>
                  {t('cards.webServer.description2')}
                </p>
                <div className="card-actions justify-end">
                  <a
                    href="https://github.com/pmh-only/ftp/tree/main/webserver"
                    target="_blank"
                    className="btn btn-accent"
                  >
                    {t('common:buttons.showSource')}
                  </a>
                </div>
              </div>
            </div>
            <div className="card w-full lg:w-82 shadow-sm">
              <div className="card-body bg-base-200 rounded-xl">
                <h2 className="card-title flex justify-between items-end">
                  <span>{t('cards.syncRepo.title')}</span>
                  <span className="text-5xl opacity-25">
                    <FolderSync className="w-[1em] h-[1em]" />
                  </span>
                </h2>
                <p>
                  {t('cards.syncRepo.description1')}
                </p>
                <p>
                  {t('cards.syncRepo.description2')}
                </p>
                <div className="card-actions justify-end">
                  <a
                    href="https://github.com/pmh-only/ftp/tree/main/syncrepo"
                    target="_blank"
                    className="btn btn-accent"
                  >
                    {t('common:buttons.showSource')}
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default AboutArchitecture
