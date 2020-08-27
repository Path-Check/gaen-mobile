import React, { FunctionComponent } from "react"
import {
  TouchableOpacity,
  Linking,
  ScrollView,
  View,
  StyleSheet,
  Image,
} from "react-native"
import { useTranslation } from "react-i18next"

import { usePermissionsContext } from "../PermissionsContext"
import { useOnboardingContext } from "../OnboardingContext"
import { useApplicationName } from "../More/useApplicationInfo"
import { GlobalText } from "../components"
import { Button } from "../components"
import { useBluetoothStatus } from "../useBluetoothStatus"
import { useHasLocationRequirements } from "../Home/useHasLocationRequirements"

import { Images } from "../assets"
import { Buttons, Colors, Spacing, Typography } from "../styles"

const NotificationsPermissions: FunctionComponent = () => {
  const { t } = useTranslation()
  const { applicationName } = useApplicationName()
  const { completeOnboarding } = useOnboardingContext()
  const { isLocationOffAndNeeded } = useHasLocationRequirements()
  const isBluetoothOn = useBluetoothStatus()

  const { exposureNotifications } = usePermissionsContext()
  const { status } = exposureNotifications
  const { authorized, enabled } = status

  const isProximityTracingOn = authorized && enabled
  const isAppSetupComplete =
    isProximityTracingOn && isBluetoothOn && !isLocationOffAndNeeded

  const handleOnPressGoToHome = () => {
    completeOnboarding()
  }

  const handleOnPressOpenSettings = async () => {
    Linking.openSettings()
    completeOnboarding()
  }

  const image = isAppSetupComplete
    ? Images.CheckInCircle
    : Images.ExclamationInCircle
  const headerText = isAppSetupComplete
    ? t("onboarding.app_setup_complete_header")
    : t("onboarding.app_setup_incomplete_header")
  const determineBodyText = () => {
    if (isAppSetupComplete) {
      return t("onboarding.app_setup_complete_body", { applicationName })
    } else if (isLocationOffAndNeeded) {
      return t("onboarding.app_setup_incomplete_location_body", {
        applicationName,
      })
    } else {
      return t("onboarding.app_setup_incomplete_body", { applicationName })
    }
  }

  const Buttons: FunctionComponent = () => {
    return (
      <>
        {isAppSetupComplete ? (
          <Button
            label={t("label.go_to_home_view")}
            onPress={handleOnPressGoToHome}
            customButtonStyle={style.primaryButton}
          />
        ) : (
          <>
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
          </>
        )}
      </>
    )
  }

  return (
    <ScrollView
      style={style.container}
      contentContainerStyle={style.contentContainer}
      alwaysBounceVertical={false}
    >
      <Image source={image} style={style.image} />
      <View style={style.textContainer}>
        <GlobalText style={style.headerText}>{headerText}</GlobalText>
        <GlobalText style={style.bodyText}>{determineBodyText()}</GlobalText>
      </View>
      <Buttons />
    </ScrollView>
  )
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.large,
    backgroundColor: Colors.primaryLightBackground,
  },
  contentContainer: {
    alignItems: "center",
    paddingVertical: Spacing.large,
  },
  image: {
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

export default NotificationsPermissions
