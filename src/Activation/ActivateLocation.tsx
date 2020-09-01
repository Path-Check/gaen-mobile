import React, { FunctionComponent, useEffect } from "react"
import {
  Alert,
  ScrollView,
  SafeAreaView,
  View,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"

import { ActivationScreens } from "../navigation"
import { GlobalText, Button } from "../components"
import { useApplicationName } from "../hooks/useApplicationInfo"
import { useActivationContext } from "../ActivationContext"

import { Colors, Spacing, Typography, Buttons } from "../styles"

const ActivateLocation: FunctionComponent = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const { applicationName } = useApplicationName()
  const { isLocationOn } = useActivationContext()

  useEffect(() => {
    if (isLocationOn) {
      navigation.navigate(ActivationScreens.ActivationSummary)
    }
  })

  const handleOnPressMaybeLater = () => {
    navigation.navigate(ActivationScreens.ActivationSummary)
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
          onPress: () => Linking.openSettings(),
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
          <GlobalText style={style.header}>
            {t("onboarding.location_header")}
          </GlobalText>
          <GlobalText style={style.subheader}>
            {t("onboarding.location_subheader")}
          </GlobalText>
          <GlobalText style={style.body}>
            {t("onboarding.location_body")}
          </GlobalText>
        </View>
        <View style={style.buttonsContainer}>
          <Button
            onPress={handleOnPressAllowLocationAccess}
            label={t("common.settings")}
          />
          <TouchableOpacity
            onPress={handleOnPressMaybeLater}
            style={style.secondaryButton}
          >
            <GlobalText style={style.secondaryButtonText}>
              {t("common.maybe_later")}
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

export default ActivateLocation
