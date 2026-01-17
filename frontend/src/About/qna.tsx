import { Trans, useTranslation } from 'react-i18next'

function AboutQnA() {
  const { t } = useTranslation('qna')

  return (
    <div
      id="architecture"
      className="w-full mt-16 flex justify-center flex-col py-6 min-h-full"
    >
      <div className="flex flex-col gap-8 items-center">
        <h2 className="font-display italic text-4xl font-bold text-center ">
          {t('title.frequentlyAsked')}{' '}
          <span className="underline decoration-accent">{t('title.questions')}</span>
        </h2>

        <div className="w-full max-w-2xl">
          <div className="collapse rounded-b-none collapse-arrow bg-base-100 border border-base-300">
            <input type="radio" name="my-accordion-2" defaultChecked />
            <div className="collapse-title font-semibold">
              {t('questions.overEngineered.question')}
            </div>
            <div className="collapse-content text-sm">
              {t('questions.overEngineered.answer')}
            </div>
          </div>

          <div className="collapse rounded-none collapse-arrow bg-base-100 border border-base-300">
            <input type="radio" name="my-accordion-2" />
            <div className="collapse-title font-semibold">
              {t('questions.protocols.question')}
            </div>
            <div className="collapse-content text-sm">
              {t('questions.protocols.answer')}
            </div>
          </div>

          <div className="collapse rounded-none collapse-arrow bg-base-100 border border-base-300">
            <input type="radio" name="my-accordion-2" />
            <div className="collapse-title font-semibold">
              {t('questions.formats.question')}
            </div>
            <div className="collapse-content text-sm">
              <Trans i18nKey="questions.formats.answer" ns="qna">
                <code></code>
              </Trans>
            </div>
          </div>

          <div className="collapse rounded-none collapse-arrow bg-base-100 border border-base-300">
            <input type="radio" name="my-accordion-2" />
            <div className="collapse-title font-semibold">
              <Trans i18nKey="questions.curl.question" ns="qna">
                <code></code>
              </Trans>
            </div>
            <div className="collapse-content text-sm">
              <Trans i18nKey="questions.curl.answer" ns="qna">
                <code></code>
                <code></code>
                <code></code>
              </Trans>
            </div>
          </div>

          <div className="collapse rounded-t-none collapse-arrow bg-base-100 border border-base-300">
            <input type="radio" name="my-accordion-2" />
            <div className="collapse-title font-semibold">
              <Trans i18nKey="questions.rsync.question" ns="qna">
                <code></code>
              </Trans>
            </div>
            <div className="collapse-content text-sm">
              <Trans i18nKey="questions.rsync.answer" ns="qna">
                <code></code>
                <code></code>
              </Trans>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutQnA
