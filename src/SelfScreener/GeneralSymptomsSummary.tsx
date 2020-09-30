import React, { FunctionComponent } from "react"
import { useNavigation } from "@react-navigation/native"
import { useTranslation } from "react-i18next"
import { View } from "react-native"
import { SelfScreenerStackScreens } from "../navigation"
import { Button, GlobalText } from "../components"

const GeneralSymptomsSummary: FunctionComponent = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()

  const handleOnPressNext = () => {
    navigation.navigate(SelfScreenerStackScreens.UnderlyingConditions)
  }

  return (
    <View>
      <GlobalText>
        {t("self_screener.general_symptoms_summary.sorry_to_hear")}
      </GlobalText>
      <GlobalText>
        {t("self_screener.general_symptoms_summary.two_more_questions")}
      </GlobalText>
      <Button label={t("common.next")} onPress={handleOnPressNext} />
    </View>
  )
}

export default GeneralSymptomsSummary
