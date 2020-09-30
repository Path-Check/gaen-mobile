import React, { FunctionComponent } from "react"
import { Linking, View } from "react-native"
import { useTranslation } from "react-i18next"

import { useConfigurationContext } from "../ConfigurationContext"
import { Button, GlobalText } from "../components"

const CallEmergencyServices: FunctionComponent = () => {
  const { t } = useTranslation()
  const { emergencyPhoneNumber } = useConfigurationContext()
  const handleOnPressCallEmergencyServices = () => {
    Linking.openURL(`tel:${emergencyPhoneNumber}`)
  }

  return (
    <View>
      <GlobalText>
        {t("self_screener.call911.seek_medical_attention")}
      </GlobalText>
      <GlobalText>
        {t("self_screener.call911.urgent_medical_attention_needed")}
      </GlobalText>
      <GlobalText>
        {t("self_screener.call911.based_on_your_symptoms")}
      </GlobalText>
      <Button
        label={t(
          "self_screener.call_emergency_services.call_emergency_services",
        )}
        onPress={handleOnPressCallEmergencyServices}
      />
    </View>
  )
}

export default CallEmergencyServices
