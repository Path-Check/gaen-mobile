import React, { FunctionComponent, useEffect } from "react"
import {
  Alert,
  ScrollView,
  SafeAreaView,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"
import { SvgXml } from "react-native-svg"

import { ActivationStackScreens } from "../navigation"
import { Text } from "../components"
import { useApplicationName } from "../Device/useApplicationInfo"
import { usePermissionsContext } from "../Device/PermissionsContext"
import { useConfigurationContext } from "../ConfigurationContext"
import { openAppSettings } from "../Device"

import { Colors, Spacing, Typography, Buttons, Outlines } from "../styles"
import { Icons } from "../assets"

const ActivateLocation: FunctionComponent = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const { applicationName } = useApplicationName()
  const { locationPermissions } = usePermissionsContext()
  const { enableProductAnalytics } = useConfigurationContext()

  useEffect(() => {
    const isLocationOn = locationPermissions === "RequiredOn"
    if (isLocationOn) {
      navigateToNextScreen()
    }
  })

  const handleOnPressMaybeLater = () => {
    navigateToNextScreen()
  }

  const navigateToNextScreen = () => {
    if (enableProductAnalytics) {
      navigation.navigate(ActivationStackScreens.AnonymizedDataConsent)
    } else {
      navigation.navigate(ActivationStackScreens.ActivationSummary)
    }
  }

  const showLocationAccessAlert = () => {
    Alert.alert(
      t("onboarding.location_alert_header", { applicationName }),
      t("onboarding.location_alert_body"),
      [
        {
          text: t("common.back"),
          style: "cancel",
        },
        {
          text: t("common.settings"),
          onPress: () => openAppSettings(),
        },
      ],
    )
  }

  const handleOnPressAllowLocationAccess = () => {
    showLocationAccessAlert()
  }

  return (
    <SafeAreaView style={style.safeArea}>
      <ScrollView
        style={style.container}
        contentContainerStyle={style.contentContainer}
        alwaysBounceVertical={false}
      >
        <View style={style.content}>
          <Text style={style.header}>{t("onboarding.location_header")}</Text>
          <View style={style.subheaderContainer}>
            <SvgXml xml={Icons.AlertCircle} fill={Colors.accent.danger150} />
            <Text style={style.subheaderText}>
              {t("onboarding.location_subheader", { applicationName })}
            </Text>
          </View>
          <Text style={style.bodyText}>
            {t("onboarding.location_body", { applicationName })}
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleOnPressAllowLocationAccess}
          style={style.button}
        >
          <Text style={style.buttonText}>{t("common.settings")}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleOnPressMaybeLater}
          style={style.secondaryButton}
        >
          <Text style={style.secondaryButtonText}>
            {t("common.maybe_later")}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const style = StyleSheet.create({
  safeArea: {
    backgroundColor: Colors.background.primaryLight,
  },
  container: {
    backgroundColor: Colors.background.primaryLight,
    height: "100%",
  },
  contentContainer: {
    paddingVertical: Spacing.large,
    paddingHorizontal: Spacing.medium,
  },
  content: {
    marginBottom: Spacing.medium,
  },
  header: {
    ...Typography.header.x60,
    marginBottom: Spacing.large,
  },
  subheaderContainer: {
    paddingVertical: Spacing.small,
    paddingHorizontal: Spacing.large,
    borderRadius: Outlines.baseBorderRadius,
    borderColor: Colors.accent.danger150,
    borderWidth: Outlines.thin,
    marginBottom: Spacing.small,
    flexDirection: "row",
    alignItems: "center",
  },
  subheaderText: {
    ...Typography.header.x20,
    color: Colors.accent.danger150,
    paddingLeft: Spacing.medium,
    paddingRight: Spacing.large,
  },
  bodyText: {
    ...Typography.body.x30,
    marginBottom: Spacing.xxLarge,
  },
  button: {
    ...Buttons.primary.base,
  },
  buttonText: {
    ...Typography.button.primary,
  },
  secondaryButton: {
    ...Buttons.secondary.base,
  },
  secondaryButtonText: {
    ...Typography.button.secondary,
  },
})

export default ActivateLocation
