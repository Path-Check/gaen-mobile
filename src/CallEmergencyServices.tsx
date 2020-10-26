import React, { FunctionComponent } from "react"
import {
  View,
  TouchableOpacity,
  Linking,
  ScrollView,
  StyleSheet,
} from "react-native"
import { useTranslation } from "react-i18next"
import { SvgXml } from "react-native-svg"

import { useConfigurationContext } from "./ConfigurationContext"
import { Text } from "./components"

import {
  Buttons,
  Colors,
  Iconography,
  Outlines,
  Spacing,
  Typography,
} from "./styles"
import { Icons } from "./assets"

const CallEmergencyServices: FunctionComponent = () => {
  const { t } = useTranslation()
  const { emergencyPhoneNumber } = useConfigurationContext()

  const handleOnPressCallEmergencyServices = () => {
    Linking.openURL(`tel:${emergencyPhoneNumber}`)
  }

  return (
    <ScrollView
      style={style.container}
      contentContainerStyle={style.contentContainer}
      alwaysBounceVertical={false}
    >
      <View>
        <SvgXml
          xml={Icons.AsteriskInCircle}
          fill={Colors.accent.danger100}
          width={Iconography.large}
          height={Iconography.large}
          style={style.icon}
        />
        <Text style={style.headerText}>
          {t("self_assessment.call_emergency_services.seek_medical_attention")}
        </Text>
        <Text style={style.bodyText}>
          {t(
            "self_assessment.call_emergency_services.urgent_medical_attention_needed",
            { emergencyPhoneNumber },
          )}
        </Text>
      </View>
      <TouchableOpacity
        onPress={handleOnPressCallEmergencyServices}
        accessibilityLabel={t(
          "self_assessment.call_emergency_services.call_emergencies",
          {
            emergencyPhoneNumber,
          },
        )}
        accessibilityRole="button"
        style={style.buttonContainer}
      >
        <Text style={style.buttonText}>
          {t("self_assessment.call_emergency_services.call_emergencies", {
            emergencyPhoneNumber,
          })}
        </Text>
        <SvgXml
          xml={Icons.Arrow}
          fill={Colors.neutral.white}
          width={Iconography.xSmall}
          height={Iconography.xSmall}
        />
      </TouchableOpacity>
    </ScrollView>
  )
}

const style = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.background.primaryLight,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: "space-around",
    paddingVertical: Spacing.xxxHuge,
    paddingHorizontal: Spacing.large,
  },
  icon: {
    marginBottom: Spacing.small,
  },
  headerText: {
    ...Typography.header2,
    marginBottom: Spacing.medium,
  },
  bodyText: {
    ...Typography.body1,
    marginBottom: Spacing.xLarge,
  },
  buttonContainer: {
    ...Buttons.primary,
    ...Buttons.medium,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "center",
    paddingHorizontal: Spacing.xLarge,
    borderRadius: Outlines.borderRadiusMax,
    backgroundColor: Colors.accent.danger100,
  },
  buttonText: {
    ...Typography.buttonPrimary,
  },
})

export default CallEmergencyServices
