import React, { FunctionComponent } from "react"
import { StyleSheet, TouchableOpacity, Linking } from "react-native"
import { SvgXml } from "react-native-svg"
import { useTranslation } from "react-i18next"

import { Text } from "../components"

import {
  Iconography,
  Spacing,
  Buttons,
  Typography,
  Colors,
  Outlines,
} from "../styles"
import { Icons } from "../assets"

interface CallEmergencyServicesProps {
  phoneNumber: string
}

const CallEmergencyServices: FunctionComponent<CallEmergencyServicesProps> = ({
  phoneNumber,
}) => {
  const { t } = useTranslation()
  const handleOnPressCallEmergencyServices = () => {
    Linking.openURL(`tel:${phoneNumber}`)
  }

  const buttonText = t("home.call_emergency_services")

  return (
    <TouchableOpacity
      onPress={handleOnPressCallEmergencyServices}
      accessibilityLabel={buttonText}
      accessibilityRole="button"
      style={style.emergencyButtonContainer}
    >
      <SvgXml
        xml={Icons.Phone}
        fill={Colors.neutral.white}
        width={Iconography.xSmall}
        height={Iconography.xSmall}
      />
      <Text style={style.emergencyButtonText}>{buttonText}</Text>
    </TouchableOpacity>
  )
}

const style = StyleSheet.create({
  emergencyButtonContainer: {
    ...Buttons.thin.base,
    borderRadius: Outlines.borderRadiusLarge,
    backgroundColor: Colors.accent.danger100,
    padding: Spacing.large,
  },
  emergencyButtonText: {
    ...Typography.button.primary,
    marginLeft: Spacing.small,
  },
})

export default CallEmergencyServices
