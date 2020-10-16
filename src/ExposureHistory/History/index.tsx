import React, { FunctionComponent, useState } from "react"
import { StyleSheet, TouchableOpacity, View, ScrollView } from "react-native"
import { SvgXml } from "react-native-svg"
import { useTranslation } from "react-i18next"
import { useNavigation, useIsFocused } from "@react-navigation/native"

import { ExposureDatum } from "../../exposure"
import { StatusBar, Text, Button } from "../../components"
import { useStatusBarEffect } from "../../navigation/index"
import { useExposureContext } from "../../ExposureContext"

import DateInfoHeader from "./DateInfoHeader"
import ExposureList from "./ExposureList"
import NoExposures from "./NoExposures"

import { Icons } from "../../assets"
import { ExposureHistoryStackScreens } from "../../navigation"
import {
  Buttons,
  Spacing,
  Typography,
  Colors,
  Outlines,
  Affordances,
} from "../../styles"
import { showMessage } from "react-native-flash-message"

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
  useStatusBarEffect("dark-content", Colors.primaryLightBackground)
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
      <StatusBar backgroundColor={Colors.primaryLightBackground} />
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
      <View style={style.bottomActionsContainer}>
        <Button
          label={t("exposure_history.check_for_exposures")}
          onPress={handleOnPressCheckForExposures}
          loading={checkingForExposures}
          customButtonStyle={style.button}
          customButtonInnerStyle={style.buttonInner}
        />
      </View>
    </>
  )
}

const style = StyleSheet.create({
  contentContainer: {
    paddingTop: Spacing.xSmall,
  },
  container: {
    paddingBottom: Spacing.medium,
    backgroundColor: Colors.primaryLightBackground,
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
  bottomActionsContainer: {
    alignItems: "center",
    borderTopWidth: Outlines.hairline,
    borderColor: Colors.neutral10,
    backgroundColor: Colors.secondary10,
    paddingTop: Spacing.small,
    paddingBottom: Spacing.medium,
    paddingHorizontal: Spacing.medium,
  },
  button: {
    width: "100%",
  },
  buttonInner: {
    ...Buttons.medium,
    width: "100%",
  },
})

export default History
