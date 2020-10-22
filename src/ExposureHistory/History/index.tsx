import React, { FunctionComponent, useState } from "react"
import { StyleSheet, TouchableOpacity, View, ScrollView } from "react-native"
import { SvgXml } from "react-native-svg"
import { useTranslation } from "react-i18next"
import { useNavigation, useIsFocused } from "@react-navigation/native"
import { showMessage } from "react-native-flash-message"

import { ExposureDatum } from "../../exposure"
import { LoadingIndicator, StatusBar, Text } from "../../components"
import { useStatusBarEffect } from "../../navigation/index"
import { useExposureContext } from "../../ExposureContext"

import DateInfoHeader from "./DateInfoHeader"
import ExposureList from "./ExposureList"
import NoExposures from "./NoExposures"

import { Icons } from "../../assets"
import { ExposureHistoryStackScreens } from "../../navigation"
import { Buttons, Spacing, Typography, Colors, Affordances } from "../../styles"

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
  const { checkForNewExposures } = useExposureContext()

  const [checkingForExposures, setCheckingForExposures] = useState<boolean>(
    false,
  )

  const handleOnPressMoreInfo = () => {
    navigation.navigate(ExposureHistoryStackScreens.MoreInfo)
  }

  const handleOnPressCheckForExposures = async () => {
    setCheckingForExposures(true)
    const checkResult = await checkForNewExposures()
    if (checkResult.kind === "success") {
      showMessage({
        message: t("common.success"),
        ...Affordances.successFlashMessageOptions,
      })
    } else {
      showMessage({
        message: t("common.something_went_wrong"),
        ...Affordances.errorFlashMessageOptions,
      })
    }
    setCheckingForExposures(false)
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
            >
              <SvgXml
                xml={Icons.QuestionMark}
                accessible
                accessibilityLabel={t("label.question_icon")}
                style={style.moreInfoButtonIcon}
              />
            </TouchableOpacity>
          </View>
          <View style={style.subheaderRow}>
            <DateInfoHeader lastDetectionDate={lastDetectionDate} />
          </View>
        </View>
        <View style={style.listContainer}>
          {showExposureHistory ? (
            <ExposureList exposures={exposures} />
          ) : (
            <NoExposures />
          )}
        </View>
      </ScrollView>
      <TouchableOpacity
        onPress={handleOnPressCheckForExposures}
        style={style.button}
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
    marginTop: Spacing.xSmall,
    marginHorizontal: Spacing.medium,
  },
  headerText: {
    ...Typography.header1,
    ...Typography.bold,
    marginRight: Spacing.medium,
  },
  moreInfoButton: {
    ...Buttons.tinyRounded,
    height: Spacing.xxLarge,
    width: Spacing.xxLarge,
  },
  moreInfoButtonIcon: {
    minHeight: Spacing.xSmall,
    minWidth: Spacing.xSmall,
  },
  subheaderRow: {
    marginTop: Spacing.xxxSmall,
    marginHorizontal: Spacing.medium,
  },
  listContainer: {
    marginTop: Spacing.xxLarge,
    marginBottom: Spacing.large,
  },
  button: {
    ...Buttons.fixedBottom,
  },
  buttonText: {
    ...Typography.buttonFixedBottom,
  },
})

export default History
