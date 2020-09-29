import React, { FunctionComponent } from "react"
import { View } from "react-native"
import { useTranslation } from "react-i18next"

import { GlobalText } from "../components"

const Summary: FunctionComponent = () => {
  const { t } = useTranslation()
  return (
    <View>
      <GlobalText>
        {t("self_screener.summary.sorry_youre_not_feeling_well")}
      </GlobalText>
    </View>
  )
}

export default Summary
