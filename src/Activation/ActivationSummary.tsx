import React, { FunctionComponent } from "react"
import {
  TouchableOpacity,
  ScrollView,
  View,
  StyleSheet,
  Image,
} from "react-native"
import { useTranslation } from "react-i18next"

import {
  usePermissionsContext,
  ENPermissionStatus,
} from "../Device/PermissionsContext"
import { useApplicationName } from "../Device/useApplicationInfo"
import { openAppSettings } from "../Device"
import { useOnboardingContext } from "../OnboardingContext"
import { Text } from "../components"

import { Images } from "../assets"
import { Buttons, Colors, Spacing, Typography } from "../styles"

const ActivationSummary: FunctionComponent = () => {
  const { t } = useTranslation()
  const { applicationName } = useApplicationName()
  const { completeOnboarding } = useOnboardingContext()
  const {
    isBluetoothOn,
    locationPermissions,
    exposureNotifications: { status },
  } = usePermissionsContext()

  const isENEnabled = status === ENPermissionStatus.ENABLED
  const isLocationRequiredAndOff = locationPermissions === "RequiredOff"
  const isLocationRequired = locationPermissions !== "NotRequired"

  const handleOnPressGoToHome = () => {
    completeOnboarding()
  }

  const handleOnPressOpenSettings = async () => {
    openAppSettings()
    completeOnboarding()
  }

  const AppSetupIncompleteButtons: FunctionComponent = () => {
    return (
      <View>
        <TouchableOpacity
          onPress={handleOnPressOpenSettings}
          style={style.button}
        >
          <Text style={style.buttonText}>{t("common.settings")}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleOnPressGoToHome}
          style={style.secondaryButton}
        >
          <Text style={style.secondaryButtonText}>
            {t("label.go_to_home_view")}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  const AppSetupCompleteButton: FunctionComponent = () => {
    return (
      <TouchableOpacity onPress={handleOnPressGoToHome} style={style.button}>
        <Text style={style.buttonText}>{t("label.go_to_home_view")}</Text>
      </TouchableOpacity>
    )
  }

  const appSetupCompleteContent = {
    headerImage: Images.CheckInCircle,
    headerText: t("onboarding.app_setup_complete_header"),
    bodyText: t("onboarding.app_setup_complete_body", { applicationName }),
    buttons: AppSetupCompleteButton,
  }

  const appSetupIncompleteContent = {
    headerImage: Images.ExclamationInCircle,
    headerText: t("onboarding.app_setup_incomplete_header"),
    bodyText: isLocationRequired
      ? t("onboarding.app_setup_incomplete_location_body", { applicationName })
      : t("onboarding.app_setup_incomplete_body", { applicationName }),
    buttons: AppSetupIncompleteButtons,
  }

  const isAppSetupComplete =
    isENEnabled && isBluetoothOn && !isLocationRequiredAndOff

  const screenContent = isAppSetupComplete
    ? appSetupCompleteContent
    : appSetupIncompleteContent
  const Buttons = screenContent.buttons

  return (
    <ScrollView
      style={style.container}
      contentContainerStyle={style.contentContainer}
    >
      <View style={style.innerContainer}>
        <View style={style.topContainer}>
          <Image source={screenContent.headerImage} style={style.headerImage} />
          <View style={style.textContainer}>
            <Text style={style.headerText}>{screenContent.headerText}</Text>
            <Text style={style.bodyText}>{screenContent.bodyText}</Text>
          </View>
        </View>
        <Buttons />
      </View>
    </ScrollView>
  )
}

const style = StyleSheet.create({
  container: {
    backgroundColor: Colors.background.primaryLight,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingTop: Spacing.small,
    paddingHorizontal: Spacing.large,
    paddingBottom: Spacing.xLarge,
  },
  innerContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  topContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  headerImage: {
    resizeMode: "cover",
    width: 230,
    height: 150,
    marginBottom: Spacing.medium,
  },
  textContainer: {
    marginBottom: Spacing.xxLarge,
  },
  headerText: {
    ...Typography.header.x60,
    textAlign: "center",
    marginBottom: Spacing.medium,
  },
  bodyText: {
    ...Typography.body.x30,
    textAlign: "center",
  },
  button: {
    ...Buttons.primary.base,
    marginBottom: Spacing.xxSmall,
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

export default ActivationSummary
