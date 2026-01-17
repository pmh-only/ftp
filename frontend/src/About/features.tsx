import { Gauge, HatGlasses, Laugh, Pizza, SearchCheck } from 'lucide-react'
import { Trans, useTranslation } from 'react-i18next'

function AboutFeatures() {
  const { t } = useTranslation('features')

  return (
    <div
      id="features"
      className="w-full min-h-full mt-16 flex justify-center flex-col py-6"
    >
      <div className="flex flex-col gap-8">
        <h2 className="font-display italic text-4xl font-bold text-center">
          {t('title.the')}{' '}
          <span className="underline decoration-accent">
            {t('title.features')}
          </span>
        </h2>

        <div className="flex justify-center gap-6 flex-wrap">
          <div className="lg:hover-3d w-full lg:w-auto">
            <div className="card w-full lg:w-82 shadow-sm">
              <div className="card-body bg-base-200 rounded-xl">
                <h2 className="card-title flex justify-between items-end">
                  <span>{t('cards.performance.title')}</span>
                  <span className="text-5xl opacity-25">
                    <Gauge className="w-[1em] h-[1em]" />
                  </span>
                </h2>
                <p>
                  <Trans i18nKey="cards.performance.description" ns="features">
                    <b className="text-accent"></b>
                  </Trans>
                </p>
              </div>
            </div>

            {/* 8 empty divs needed for the 3D effect */}
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>

          <div className="lg:hover-3d w-full lg:w-auto">
            <div className="card w-full lg:w-82 shadow-sm">
              <div className="card-body bg-base-200 rounded-xl">
                <h2 className="card-title flex justify-between items-end">
                  <span>{t('cards.reliable.title')}</span>
                  <span className="text-5xl opacity-25">
                    <Laugh className="w-[1em] h-[1em]" />
                  </span>
                </h2>
                <p>
                  <Trans i18nKey="cards.reliable.description" ns="features">
                    <b className="text-accent"></b>
                    <b className="text-accent"></b>
                  </Trans>
                </p>
              </div>
            </div>

            {/* 8 empty divs needed for the 3D effect */}
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>

          <div className="lg:hover-3d w-full lg:w-auto">
            <div className="card w-full lg:w-82 shadow-sm">
              <div className="card-body bg-base-200 rounded-xl">
                <h2 className="card-title flex justify-between items-end">
                  <span>{t('cards.anonymous.title')}</span>
                  <span className="text-5xl opacity-25">
                    <HatGlasses className="w-[1em] h-[1em]" />
                  </span>
                </h2>
                <p>
                  <Trans i18nKey="cards.anonymous.description" ns="features">
                    <b className="text-accent"></b>
                    <b className="text-accent"></b>
                    <sup></sup>
                  </Trans>
                </p>
              </div>
            </div>

            {/* 8 empty divs needed for the 3D effect */}
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>

          <div className="lg:hover-3d w-full lg:w-auto">
            <div className="card w-full lg:w-82 shadow-sm">
              <div className="card-body bg-base-200 rounded-xl">
                <h2 className="card-title flex justify-between items-end">
                  <span>{t('cards.transparent.title')}</span>
                  <span className="text-5xl opacity-25">
                    <SearchCheck className="w-[1em] h-[1em]" />
                  </span>
                </h2>
                <p>
                  <Trans i18nKey="cards.transparent.description" ns="features">
                    <b className="text-accent"></b>
                  </Trans>
                </p>
              </div>
            </div>

            {/* 8 empty divs needed for the 3D effect */}
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>

          <div className="lg:hover-3d w-full lg:w-auto">
            <div className="card w-full lg:w-82 shadow-sm">
              <div className="card-body bg-base-200 rounded-xl">
                <h2 className="card-title flex justify-between items-end">
                  <span>{t('cards.shortUrl.title')}</span>
                  <span className="text-5xl opacity-25">
                    <Pizza className="w-[1em] h-[1em]" />
                  </span>
                </h2>
                <p>
                  <Trans i18nKey="cards.shortUrl.description" ns="features">
                    <b className="text-accent"></b>
                  </Trans>
                </p>
              </div>
            </div>

            {/* 8 empty divs needed for the 3D effect */}
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

        <h2 className="italic font-light text-center">{t('moreTeaser')}</h2>
      </div>
    </div>
  )
}

export default AboutFeatures
