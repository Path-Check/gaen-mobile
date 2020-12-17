import { useTranslation } from "react-i18next"

import * as Locale from "../locales/locale"
import copy from "../../config/copy.json"

const DEFAULT_LOCALE = "en"

type Resource = Partial<Record<Locale.Locale, CustomCopy>> & { en: CustomCopy }

interface CustomCopy {
  welcomeMessage?: string
  about?: string
  legal?: string
  healthAuthorityName: string
  verificationCodeInfo?: string
  verificationCodeHowDoIGet?: string
  appTransition?: {
    header: string
    body1: string
    body2: string
  }
}

const customCopyByLocale = copy as Resource

export const useCustomCopy = (): CustomCopy => {
  const {
    i18n: { language: localeCode },
  } = useTranslation()

  const locale = Locale.fromString(localeCode)

  return customCopyByLocale[locale] || customCopyByLocale[DEFAULT_LOCALE] || {}
}
