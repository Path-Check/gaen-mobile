import React, { FunctionComponent } from "react"
import {
  Alert,
  ScrollView,
  SafeAreaView,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native"
import { useTranslation } from "react-i18next"
import { SvgXml } from "react-native-svg"

import { Text } from "../components"
import { useApplicationName } from "../Device/useApplicationInfo"
import { usePermissionsContext } from "../Device/PermissionsContext"
import { openAppSettings } from "../Device"

import {
  Colors,
  Spacing,
  Typography,
  Buttons,
  Outlines,
  Iconography,
} from "../styles"
import { Icons } from "../assets"
import { useActivationNavigation } from "./useActivationNavigation"

const ActivateLocation: FunctionComponent = () => {
  const { t } = useTranslation()
  const { applicationName } = useApplicationName()
  const { exposureNotifications } = usePermissionsContext()

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
        {exposureNotifications.status === "LocationOffAndRequired" ? (
          <EnableLocationButtons />
        ) : (
          <LocationAlreadyEnabledButtons />
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const EnableLocationButtons: FunctionComponent = () => {
  const { t } = useTranslation()
  const { applicationName } = useApplicationName()
  const { goToNextScreenFrom } = useActivationNavigation()

  const handleOnPressMaybeLater = () => {
    goToNextScreenFrom("ActivateLocation")
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
    <View>
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
        <Text style={style.secondaryButtonText}>{t("common.maybe_later")}</Text>
      </TouchableOpacity>
    </View>
  )
}

const LocationAlreadyEnabledButtons: FunctionComponent = () => {
  const { t } = useTranslation()
  const { goToNextScreenFrom } = useActivationNavigation()

  const handleOnPressContinue = () => {
    goToNextScreenFrom("ActivateExposureNotifications")
  }

  return (
    <View style={style.alreadyActiveContainer}>
      <View style={style.alreadyActiveInfoContainer}>
        <View style={style.alreadyActiveIconContainer}>
          <SvgXml
            xml={Icons.CheckInCircle}
            fill={Colors.accent.success100}
            width={Iconography.xSmall}
            height={Iconography.xSmall}
          />
        </View>
        <View style={style.alreadyActiveTextContainer}>
          <Text style={style.alreadyActiveText}>
            {t("onboarding.location_services_already_active")}
          </Text>
        </View>
      </View>
      <TouchableOpacity onPress={handleOnPressContinue} style={style.button}>
        <Text style={style.buttonText}>{t("common.continue")}</Text>
      </TouchableOpacity>
    </View>
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
  alreadyActiveContainer: {
    borderTopWidth: 1,
    borderTopColor: Colors.neutral.shade50,
  },
  alreadyActiveInfoContainer: {
    flexDirection: "row",
    paddingVertical: Spacing.large,
  },
  alreadyActiveIconContainer: {
    flex: 1,
    justifyContent: "center",
  },
  alreadyActiveTextContainer: {
    flex: 8,
    justifyContent: "center",
  },
  alreadyActiveText: {
    ...Typography.body.x30,
  },
})

export default ActivateLocation
