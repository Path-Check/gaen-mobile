import React, { FunctionComponent, useState } from "react"
import {
  Alert,
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native"
import { SvgXml } from "react-native-svg"
import { useTranslation } from "react-i18next"
import { useNavigation, useIsFocused } from "@react-navigation/native"

import { ExposureDatum } from "../../exposure"
import { LoadingIndicator, StatusBar, Text } from "../../components"
import { useStatusBarEffect } from "../../navigation/index"
import DateInfoHeader from "./DateInfoHeader"
import HasExposures from "./HasExposures"
import NoExposures from "./NoExposures"
import { useExposureContext } from "../../ExposureContext"

import { Icons } from "../../assets"
import { ExposureHistoryStackScreens } from "../../navigation"
import { Buttons, Spacing, Typography, Colors, Iconography } from "../../styles"
import { usePermissionsContext } from "../../Device/PermissionsContext"
import { useRequestExposureNotifications } from "../../useRequestExposureNotifications"

type Posix = number

interface HistoryProps {
  lastDetectionDate: Posix | null
  exposures: ExposureDatum[]
}

const History: FunctionComponent<HistoryProps> = ({
  lastDetectionDate,
  exposures,
}) => {
  useIsFocused()
  useStatusBarEffect("dark-content", Colors.background.primaryLight)
  const { t } = useTranslation()
  const navigation = useNavigation()
  const { detectExposures } = useExposureContext()
  const {
    exposureNotifications: { status },
  } = usePermissionsContext()
  const requestExposureNotifications = useRequestExposureNotifications()

  const [checkingForExposures, setCheckingForExposures] = useState<boolean>(
    false,
  )

  const handleOnPressMoreInfo = () => {
    navigation.navigate(ExposureHistoryStackScreens.MoreInfo)
  }

  const showEnableExposureNotificationsAlert = () => {
    Alert.alert(
      t("exposure_notification_alerts.cant_check_for_exposures_title"),
      t("exposure_notification_alerts.cant_check_for_exposures_body"),
      [
        {
          text: t("common.back"),
          style: "cancel",
        },
        {
          text: t(
            "exposure_notification_alerts.cant_check_for_exposures_button",
          ),
          onPress: () => requestExposureNotifications(),
        },
      ],
    )
  }

  const checkForExposures = async () => {
    setCheckingForExposures(true)
    const result = await detectExposures()
    if (result.kind === "success") {
      showAlert(t("exposure_notification_alerts.exposure_check_complete"), "")
    } else if (result.kind === "failure") {
      switch (result.error) {
        case "RateLimited":
          showAlert(
            t("exposure_notification_alerts.exposure_check_complete"),
            "",
          )
          break
        case "NotAuthorized":
          showAlert(
            t(
              "exposure_notification_alerts.share_exposure_information_ios_title",
            ),
            t(
              "exposure_notification_alerts.share_exposure_information_ios_body",
            ),
          )
          break
        case "DataInaccessible":
          showAlert(
            t("exposure_notification_alerts.requires_network_title"),
            t("exposure_notification_alerts.requires_network_body"),
          )
          break
        default:
          showAlert(
            t("exposure_notification_alerts.unhandled_error_title"),
            t("exposure_notification_alerts.unhandled_error_body"),
          )
      }
    }
    setCheckingForExposures(false)
  }

  const showAlert = (title: string, body: string) => {
    Alert.alert(title, body, [
      {
        text: t("common.ok"),
      },
    ])
  }

  const handleOnPressCheckForExposures = async () => {
    if (status !== "Active") {
      showEnableExposureNotificationsAlert()
    } else {
      await checkForExposures()
    }
  }

  const showExposureHistory = exposures.length > 0

  return (
    <>
      <StatusBar backgroundColor={Colors.background.primaryLight} />
      <ScrollView
        contentContainerStyle={style.contentContainer}
        style={style.container}
        alwaysBounceVertical={false}
      >
        <View>
          <View style={style.headerRow}>
            <Text style={style.headerText}>
              {t("screen_titles.exposure_history")}
            </Text>
            <TouchableOpacity
              onPress={handleOnPressMoreInfo}
              style={style.moreInfoButton}
              accessibilityRole="button"
              accessibilityLabel={t("exposure_history.more_info")}
            >
              <SvgXml
                xml={Icons.QuestionMark}
                fill={Colors.primary.shade125}
                width={Iconography.xxxSmall}
                height={Iconography.xxxSmall}
              />
            </TouchableOpacity>
          </View>
          <View style={style.subheaderRow}>
            <DateInfoHeader lastDetectionDate={lastDetectionDate} />
          </View>
        </View>
        <View style={style.listContainer}>
          {showExposureHistory ? (
            <HasExposures exposures={exposures} />
          ) : (
            <NoExposures />
          )}
        </View>
      </ScrollView>
      <TouchableOpacity
        onPress={handleOnPressCheckForExposures}
        style={style.button}
        disabled={checkingForExposures}
        testID="check-for-exposures-button"
      >
        <Text style={style.buttonText}>
          {t("exposure_history.check_for_exposures")}
        </Text>
      </TouchableOpacity>
      {checkingForExposures && <LoadingIndicator />}
    </>
  )
}

const style = StyleSheet.create({
  contentContainer: {
    paddingTop: Spacing.xSmall,
  },
  container: {
    paddingBottom: Spacing.medium,
    backgroundColor: Colors.background.primaryLight,
  },
  headerRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginTop: Spacing.xxSmall,
    marginHorizontal: Spacing.medium,
  },
  headerText: {
    ...Typography.header.x60,
    ...Typography.style.bold,
    marginRight: Spacing.medium,
  },
  moreInfoButton: {
    ...Buttons.circle.base,
  },
  subheaderRow: {
    marginTop: Spacing.xxxSmall,
    marginHorizontal: Spacing.medium,
  },
  listContainer: {
    marginTop: Spacing.medium,
    marginBottom: Spacing.large,
  },
  button: {
    ...Buttons.fixedBottom.base,
  },
  buttonText: {
    ...Typography.button.fixedBottom,
  },
})

export default History
