import { useNavigation } from "@react-navigation/native"
import React, { FunctionComponent } from "react"
import { useTranslation } from "react-i18next"
import { View } from "react-native"
import { SelfScreenerStackScreens } from "../navigation"
import { Button, GlobalText } from "../components"

const NoEmergencySymptoms: FunctionComponent = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()

  const handleOnPressNext = () => {
    navigation.navigate(SelfScreenerStackScreens.GeneralSymptoms)
  }

  return (
    <View>
      <GlobalText>
        {t("self_screener.no_emergency_symptoms.glad_to_hear")}
      </GlobalText>
      <GlobalText>
        {t("self_screener.no_emergency_symptoms.one_more_question")}
      </GlobalText>
      <Button label={t("common.next")} onPress={handleOnPressNext} />
    </View>
  )
}

export default NoEmergencySymptoms
