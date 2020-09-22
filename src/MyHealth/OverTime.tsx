import React, { FunctionComponent } from "react"
import { View } from "react-native"
import { useTranslation } from "react-i18next"

import { useSymptomLogContext } from "./SymptomLogContext"
import { HealthAssessment } from "./symptoms"
import { GlobalText } from "../components"

const OverTime: FunctionComponent = () => {
  const { t } = useTranslation()
  const { logEntries } = useSymptomLogContext()

  return (
    <View>
      {logEntries.map((logEntry) => {
        const healthAssessmentText =
          logEntry.healthAssessment === HealthAssessment.AtRisk
            ? t("my_health.symptom_log.feeling_not_well")
            : t("my_health.symptom_log.feeling_well")

        return <GlobalText key={logEntry.id}>{healthAssessmentText}</GlobalText>
      })}
    </View>
  )
}

export default OverTime
