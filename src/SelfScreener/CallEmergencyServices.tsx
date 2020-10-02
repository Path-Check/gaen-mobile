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

import { useConfigurationContext } from "../ConfigurationContext"
import { GlobalText } from "../components"

import {
  Buttons,
  Colors,
  Iconography,
  Outlines,
  Spacing,
  Typography,
} from "../styles"
import { Icons } from "../assets"

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
          fill={Colors.danger100}
          width={Iconography.medium}
          height={Iconography.medium}
          style={style.icon}
        />
        <GlobalText style={style.headerText}>
          {t("self_screener.call_emergency_services.seek_medical_attention")}
        </GlobalText>
        <GlobalText style={style.bodyText}>
          {t(
            "self_screener.call_emergency_services.urgent_medical_attention_needed",
            { emergencyPhoneNumber },
          )}
        </GlobalText>
      </View>
      <TouchableOpacity
        onPress={handleOnPressCallEmergencyServices}
        accessibilityLabel={t(
          "self_screener.call_emergency_services.call_emergency_services",
        )}
        accessibilityRole="button"
        style={style.buttonContainer}
      >
        <GlobalText style={style.buttonText}>
          {t("self_screener.call_emergency_services.call_emergencies", {
            emergencyPhoneNumber,
          })}
        </GlobalText>
        <SvgXml
          xml={Icons.Arrow}
          fill={Colors.white}
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
    backgroundColor: Colors.secondary10,
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
    backgroundColor: Colors.danger100,
  },
  buttonText: {
    ...Typography.buttonPrimary,
  },
})

export default CallEmergencyServices
