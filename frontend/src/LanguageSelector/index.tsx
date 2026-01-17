import { useTranslation } from 'react-i18next'

function LanguageSelector() {
  const { i18n } = useTranslation()

  const handleLanguageChange = (language: string) => {
    localStorage.setItem('ftp.io.kr.language', language)
    i18n.changeLanguage(language)
  }

  const currentLanguage = i18n.language || 'en'

  return (
    <div className="flex gap-2 items-center">
      <button
        onClick={() => handleLanguageChange('en')}
        className={`text-xs ${currentLanguage === 'en' ? 'font-bold underline' : 'opacity-50 hover:opacity-100'}`}
      >
        EN
      </button>
      <span className="text-xs opacity-30">|</span>
      <button
        onClick={() => handleLanguageChange('ko')}
        className={`text-xs ${currentLanguage === 'ko' ? 'font-bold underline' : 'opacity-50 hover:opacity-100'}`}
      >
        KO
      </button>
    </div>
  )
}

export default LanguageSelector
