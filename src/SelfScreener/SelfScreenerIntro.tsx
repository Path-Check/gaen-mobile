import React, { FunctionComponent } from "react"
import { useNavigation } from "@react-navigation/native"
import { useTranslation } from "react-i18next"
import { SafeAreaView } from "react-native"

import { SelfScreenerStackScreens } from "../navigation"
import { Button, GlobalText } from "../components"

const SelfScreenerIntro: FunctionComponent = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()

  const handleOnPressStartScreener = () => {
    navigation.navigate(SelfScreenerStackScreens.EmergencySymptomsQuestions)
  }

  return (
    <SafeAreaView>
      <GlobalText>{t("self_screener.intro.covid19_self_screener")}</GlobalText>
      <Button
        onPress={handleOnPressStartScreener}
        label={t("self_screener.intro.agree_and_start_screener")}
      />
    </SafeAreaView>
  )
}

export default SelfScreenerIntro
