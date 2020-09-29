import React, { FunctionComponent } from "react"
import {
  ScrollView,
  SafeAreaView,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"

import { usePermissionsContext } from "../PermissionsContext"
import { ActivationStackScreens } from "../navigation"
import { GlobalText, Button } from "../components"
import { useSystemServicesContext } from "../SystemServicesContext"
import { isPlatformiOS } from "../utils"

import { Spacing, Typography, Buttons, Colors } from "../styles"

const ActivateProximityTracing: FunctionComponent = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()

  const { locationPermissions } = useSystemServicesContext()
  const isLocationRequiredAndOff = locationPermissions === "RequiredOff"

  const { exposureNotifications } = usePermissionsContext()

  const navigateToNextScreen = () => {
    if (isPlatformiOS()) {
      navigation.navigate(ActivationStackScreens.NotificationPermissions)
    } else {
      isLocationRequiredAndOff
        ? navigation.navigate(ActivationStackScreens.ActivateLocation)
        : navigation.navigate(ActivationStackScreens.ActivationSummary)
    }
  }

  const handleOnPressActivateProximityTracing = async () => {
    await exposureNotifications.request()
    navigateToNextScreen()
  }

  const handleOnPressDontEnable = () => {
    navigateToNextScreen()
  }

  return (
    <SafeAreaView style={style.safeArea}>
      <ScrollView
        style={style.container}
        contentContainerStyle={style.contentContainer}
        alwaysBounceVertical={false}
      >
        <View style={style.content}>
          <GlobalText style={style.header}>
            {t("onboarding.proximity_tracing_header")}
          </GlobalText>
          <GlobalText style={style.subheader}>
            {t("onboarding.proximity_tracing_subheader1")}
          </GlobalText>
          <GlobalText style={style.body}>
            {t("onboarding.proximity_tracing_body1")}
          </GlobalText>
          <GlobalText style={style.subheader}>
            {t("onboarding.proximity_tracing_subheader2")}
          </GlobalText>
          <GlobalText style={style.body}>
            {t("onboarding.proximity_tracing_body2")}
          </GlobalText>
          <GlobalText style={style.subheader}>
            {t("onboarding.proximity_tracing_subheader3")}
          </GlobalText>
        </View>
        <View style={style.buttonsContainer}>
          <Button
            onPress={handleOnPressActivateProximityTracing}
            label={t("onboarding.proximity_tracing_button")}
          />
          <TouchableOpacity
            onPress={handleOnPressDontEnable}
            style={style.secondaryButton}
          >
            <GlobalText style={style.secondaryButtonText}>
              {t("common.no_thanks")}
            </GlobalText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
const style = StyleSheet.create({
  safeArea: {
    backgroundColor: Colors.primaryLightBackground,
  },
  container: {
    backgroundColor: Colors.primaryLightBackground,
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
    ...Typography.header1,
    marginBottom: Spacing.large,
  },
  subheader: {
    ...Typography.header5,
    marginBottom: Spacing.xSmall,
  },
  body: {
    ...Typography.body1,
    marginBottom: Spacing.xxLarge,
  },
  buttonsContainer: {
    alignSelf: "flex-start",
  },
  secondaryButton: {
    ...Buttons.secondary,
  },
  secondaryButtonText: {
    ...Typography.buttonSecondary,
  },
})

export default ActivateProximityTracing
