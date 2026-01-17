import { useTranslation } from 'react-i18next'

function AboutCredit() {
  const { t } = useTranslation('credit')

  return (
    <div id="credit" className="w-full flex justify-center flex-col py-6">
      <div className="flex flex-col gap-8 items-center">
        <div className="flex flex-col w-fit leading-none">
          <h1 className="font-bold italic font-display text-5xl">
            <span className="font-thin">ftp</span>.io.kr.
          </h1>
        </div>

        <div className="text-xs text-center max-w-lg flex flex-col gap-2">
          <p>
            {t('copyright', { year: new Date().getFullYear() })}{' '}
            <a href="https://github.com/pmh-only" target="_blank">
              {t('author')}
            </a>
            &nbsp; &lt;
            <a href={`mailto:${t('email')}`} target="_blank">
              {t('email')}
            </a>
            &gt;
          </p>
          <details>
            <summary className="cursor-pointer hover:underline">
              {t('personalData.title')}
            </summary>
            {t('personalData.content')}
          </details>
          <details>
            <summary className="cursor-pointer hover:underline">
              {t('legal.title')}
            </summary>
            {t('legal.content')}
          </details>
        </div>
      </div>
    </div>
  )
}

export default AboutCredit
