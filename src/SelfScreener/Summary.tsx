import React, { FunctionComponent } from "react"
import { View } from "react-native"
import { useTranslation } from "react-i18next"

import { Button, GlobalText } from "../components"
import { useSelfScreenerContext } from "../SelfScreenerContext"
import { SymptomGroup } from "./selfScreener"
import { SelfScreenerStackScreens } from "../navigation"
import { useNavigation } from "@react-navigation/native"

const Summary: FunctionComponent = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const { symptomGroup } = useSelfScreenerContext()

  const getSummaryTextForSymptomGroup = (): string => {
    switch (symptomGroup) {
      case SymptomGroup.PRIMARY_1:
        return t("self_screener.summary.primary_symptom_group_1")
      case SymptomGroup.PRIMARY_2:
        return t("self_screener.summary.primary_symptom_group_2")
      case SymptomGroup.PRIMARY_3:
        return t("self_screener.summary.primary_symptom_group_3")
      case SymptomGroup.SECONDARY_1:
        return t("self_screener.summary.secondary_symptom_group_1")
      case SymptomGroup.SECONDARY_2:
        return t("self_screener.summary.secondary_symptom_group_2")
      case SymptomGroup.NON_COVID:
        return t("self_screener.summary.non_covid_symptom_group")
      case SymptomGroup.ASYMPTOMATIC:
        return t("self_screener.summary.asymptomatic_group")
      default:
        return t("self_screener.summary.asymptomatic_group")
    }
  }

  const handleOnPressNext = () => {
    navigation.navigate(SelfScreenerStackScreens.Guidance)
  }

  return (
    <View>
      <GlobalText>{getSummaryTextForSymptomGroup()}</GlobalText>
      <Button
        label={t("self_screener.summary.get_my_guidance")}
        onPress={handleOnPressNext}
      />
    </View>
  )
}

export default Summary
