import React, { FunctionComponent } from "react"
import { useNavigation } from "@react-navigation/native"
import { useTranslation } from "react-i18next"

import { useAnalyticsContext } from "../AnalyticsContext"
import { SwitchListItem } from "../components"
import { SettingsScreens } from "../navigation"

const ShareAnonymizedDataSwitch: FunctionComponent = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const { userConsentedToAnalytics, updateUserConsent } = useAnalyticsContext()

  const toggleDataConsent = () => {
    if (userConsentedToAnalytics) {
      updateUserConsent(false)
    } else {
      navigation.navigate(SettingsScreens.AnonymizedDataConsent)
    }
  }
  return (
    <SwitchListItem
      onChange={toggleDataConsent}
      isActive={userConsentedToAnalytics}
      label={t("settings.share_anonymized_data")}
      testID="share-anonymized-data-switch"
    />
  )
}

export default ShareAnonymizedDataSwitch
