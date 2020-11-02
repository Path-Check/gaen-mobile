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

import { ActivationStackScreens } from "../navigation"
import { Text } from "../components"
import { useApplicationName } from "../Device/useApplicationInfo"
import { usePermissionsContext } from "../Device/PermissionsContext"
import { openAppSettings } from "../Device"

import { Colors, Spacing, Typography, Buttons } from "../styles"

const ActivateLocation: FunctionComponent = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const { applicationName } = useApplicationName()
  const { locationPermissions } = usePermissionsContext()

  useEffect(() => {
    const isLocationOn = locationPermissions === "RequiredOn"
    if (isLocationOn) {
      navigation.navigate(ActivationStackScreens.AnonymizedDataConsent)
    }
  })

  const handleOnPressMaybeLater = () => {
    navigation.navigate(ActivationStackScreens.AnonymizedDataConsent)
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
          <Text style={style.subheader}>
            {t("onboarding.location_subheader")}
          </Text>
          <Text style={style.body}>{t("onboarding.location_body")}</Text>
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
  subheader: {
    ...Typography.header.x20,
    marginBottom: Spacing.xSmall,
  },
  body: {
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
