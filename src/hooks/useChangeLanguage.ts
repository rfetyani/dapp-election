import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

export default function useChangeLanguage() {
  const { i18n } = useTranslation()
  const currentLanguage = i18n.language
  const changeLanguage = useCallback(
    (lang: string) => {
      i18n.changeLanguage(lang)
    },
    [i18n]
  )
  return {
    currentLanguage,
    changeLanguage,
  }
}
