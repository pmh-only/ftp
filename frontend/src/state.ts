import { atom } from 'jotai'

export const pathState = atom(window.location.pathname)
export const tabState = atom<'ABOUT' | 'DIR_EXPLORER'>(
  window.location.pathname === '/' ? 'ABOUT' : 'DIR_EXPLORER'
)
export const languagePromptShownState = atom(
  localStorage.getItem('ftp.io.kr.languagePromptShown') === 'true'
)
