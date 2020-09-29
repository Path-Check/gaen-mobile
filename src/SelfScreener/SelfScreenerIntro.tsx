import React, { FunctionComponent } from "react"
import { useTranslation } from "react-i18next"
import { SafeAreaView } from "react-native"

import { GlobalText } from "../components"

const SelfScreenerIntro: FunctionComponent = () => {
  const { t } = useTranslation()
  return (
    <SafeAreaView>
      <GlobalText>{t("self_screener.intro.header")}</GlobalText>
    </SafeAreaView>
  )
}

export default SelfScreenerIntro
