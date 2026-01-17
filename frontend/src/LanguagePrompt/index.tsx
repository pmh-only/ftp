import { useSetAtom } from 'jotai'
import { useTranslation } from 'react-i18next'
import { languagePromptShownState } from '../state'

function LanguagePrompt() {
  const { i18n } = useTranslation()
  const setLanguagePromptShown = useSetAtom(languagePromptShownState)

  const handleLanguageSelect = (language: string) => {
    localStorage.setItem('ftp.io.kr.language', language)
    localStorage.setItem('ftp.io.kr.languagePromptShown', 'true')
    i18n.changeLanguage(language)
    setLanguagePromptShown(true)
  }

  return (
    <dialog className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg text-center mb-4">
          Choose your language
        </h3>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => handleLanguageSelect('en')}
            className="btn btn-lg btn-accent"
          >
            🇺🇸 English
          </button>
          <button
            onClick={() => handleLanguageSelect('ko')}
            className="btn btn-lg btn-accent"
          >
            🇰🇷 한국어
          </button>
        </div>
      </div>
    </dialog>
  )
}

export default LanguagePrompt
