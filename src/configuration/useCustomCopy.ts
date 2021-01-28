import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"

import * as Locale from "../locales/locale"
import copy from "../../config/copy.json"
import { useConfigurationContext } from "../ConfigurationContext"
import * as API from "./remoteContentAPI"

const DEFAULT_LOCALE = "en"

const fallbackCopyByLocale = copy as API.Resource

export const useCustomCopy = (): API.CustomCopy => {
  const { remoteContentUrl } = useConfigurationContext()
  const {
    i18n: { language: localeCode },
  } = useTranslation()
  const [remoteCustomCopy, setRemoteCustomCopy] = useState<API.Resource | null>(
    null,
  )

  const locale = Locale.fromString(localeCode)

  useEffect(() => {
    const fetchCopy = async () => {
      if (remoteContentUrl) {
        const response = await API.fetchCustomCopy(remoteContentUrl)

        if (response.kind === "success") {
          const { data } = response
          setRemoteCustomCopy(data)
        }
      }
    }

    fetchCopy()
  }, [remoteContentUrl])

  const copyByLocale = remoteCustomCopy || fallbackCopyByLocale
  const customCopy = copyByLocale[locale] || copyByLocale[DEFAULT_LOCALE] || {}

  return customCopy
}
