import React, { FunctionComponent } from "react"
import { useTranslation } from "react-i18next"
import { View } from "react-native"
import { GlobalText } from "../components"
import { useSelfScreenerContext } from "../SelfScreenerContext"
import { SymptomGroup } from "./selfScreener"
import * as Instructions from "./Instructions"

const Guidance: FunctionComponent = () => {
  const { t } = useTranslation()
  const { symptomGroup } = useSelfScreenerContext()

  if (symptomGroup === null) {
    return <></>
  }

  const introForSymptomGroup = (group: SymptomGroup) => {
    switch (group) {
      case SymptomGroup.PRIMARY_1:
        return t("self_screener.guidance.you_have_underlying_conditions")
      case SymptomGroup.PRIMARY_2:
      case SymptomGroup.SECONDARY_2:
      case SymptomGroup.PRIMARY_3:
      case SymptomGroup.SECONDARY_1:
        return t("self_screener.guidance.your_symptoms_might_be_related")
      case SymptomGroup.NON_COVID:
        return t("self_screener.guidance.monitor_your_symptoms")
      case SymptomGroup.ASYMPTOMATIC:
        return t("self_screener.guidance.feeling_fine")
      default:
        return t("self_screener.guidance.feeling_fine")
    }
  }

  const instructionsForSymptomGroup = (group: SymptomGroup) => {
    switch (group) {
      case SymptomGroup.PRIMARY_1:
      case SymptomGroup.PRIMARY_2:
      case SymptomGroup.SECONDARY_2:
        return <Instructions.CallYourHealthcareProvider />
      case SymptomGroup.PRIMARY_3:
      case SymptomGroup.SECONDARY_1:
        return <Instructions.StayHomeExceptForMedicalCare />
      case SymptomGroup.NON_COVID:
        return <Instructions.WatchForSymptoms />
      case SymptomGroup.ASYMPTOMATIC:
        return <Instructions.Quarantine />
      default:
        return <Instructions.Quarantine />
    }
  }

  return (
    <View>
      <GlobalText>{t("self_screener.guidance.guidance")}</GlobalText>
      <GlobalText>{introForSymptomGroup(symptomGroup)}</GlobalText>
      <GlobalText>
        {t("self_screener.guidance.how_to_care_for_yourself_and_others")}
      </GlobalText>
      {instructionsForSymptomGroup(symptomGroup)}
    </View>
  )
}

export default Guidance
