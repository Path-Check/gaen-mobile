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
} from "../PermissionsContext"
import { useOnboardingContext } from "../OnboardingContext"
import { useApplicationName } from "../hooks/useApplicationInfo"
import { GlobalText, Button } from "../components"
import { useSystemServicesContext } from "../SystemServicesContext"
import { openAppSettings } from "../gaen/nativeModule"

import { Images } from "../assets"
import { Buttons, Colors, Spacing, Typography } from "../styles"

const ActivationSummary: FunctionComponent = () => {
  const { t } = useTranslation()
  const { applicationName } = useApplicationName()
  const { completeOnboarding } = useOnboardingContext()
  const { isBluetoothOn, locationPermissions } = useSystemServicesContext()
  const isLocationRequiredAndOff = locationPermissions === "RequiredOff"
  const isLocationRequired = locationPermissions !== "NotRequired"

  const {
    exposureNotifications: { status },
  } = usePermissionsContext()
  const isENEnabled = status === ENPermissionStatus.ENABLED

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
        <Button
          label={t("common.settings")}
          onPress={handleOnPressOpenSettings}
          customButtonStyle={style.primaryButton}
        />
        <TouchableOpacity
          onPress={handleOnPressGoToHome}
          style={style.secondaryButton}
        >
          <GlobalText style={style.secondaryButtonText}>
            {t("label.go_to_home_view")}
          </GlobalText>
        </TouchableOpacity>
      </View>
    )
  }

  const AppSetupCompleteButton: FunctionComponent = () => {
    return (
      <Button
        label={t("label.go_to_home_view")}
        onPress={handleOnPressGoToHome}
        customButtonStyle={style.primaryButton}
      />
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
            <GlobalText style={style.headerText}>
              {screenContent.headerText}
            </GlobalText>
            <GlobalText style={style.bodyText}>
              {screenContent.bodyText}
            </GlobalText>
          </View>
        </View>
        <Buttons />
      </View>
    </ScrollView>
  )
}

const style = StyleSheet.create({
  container: {
    backgroundColor: Colors.primaryLightBackground,
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
    ...Typography.header1,
    textAlign: "center",
    marginBottom: Spacing.medium,
  },
  bodyText: {
    ...Typography.body1,
    textAlign: "center",
  },
  primaryButton: {
    width: "100%",
    marginBottom: Spacing.xxSmall,
  },
  secondaryButton: {
    ...Buttons.secondary,
    alignSelf: "center",
  },
  secondaryButtonText: {
    ...Typography.buttonSecondary,
  },
})

export default ActivationSummary
