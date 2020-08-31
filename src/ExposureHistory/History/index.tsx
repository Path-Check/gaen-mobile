import React, { FunctionComponent, useState, useEffect, useRef } from "react"
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  RefreshControl,
} from "react-native"
import { SvgXml } from "react-native-svg"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"
import isEqual from "lodash.isequal"

import { ExposureDatum } from "../../exposure"
import { GlobalText } from "../../components"

import DateInfoHeader from "./DateInfoHeader"
import ExposureList from "./ExposureList"
import NoExposures from "./NoExposures"

import { Icons } from "../../assets"
import { Screens } from "../../navigation"
import { Buttons, Spacing, Typography, Colors } from "../../styles"

type Posix = number

interface HistoryProps {
  lastDetectionDate: Posix | null
  exposures: ExposureDatum[]
}

const History: FunctionComponent<HistoryProps> = ({
  lastDetectionDate,
  exposures,
}) => {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const [refreshing, setRefreshing] = useState(false)
  const previousExposuresRef = useRef<ExposureDatum[]>()

  useEffect(() => {
    previousExposuresRef.current = exposures
  })

  const handleOnPressMoreInfo = () => {
    navigation.navigate(Screens.MoreInfo)
  }

  const handleOnRefresh = () => {
    const previousExposures = previousExposuresRef.current

    if (!isEqual(previousExposures, exposures)) {
      setRefreshing(true)
    }
    setRefreshing(false)
  }

  const showExposureHistory = exposures.length > 0

  const titleText = t("screen_titles.exposure_history")

  return (
    <>
      <SafeAreaView style={style.safeAreaTop} />
      <SafeAreaView style={style.safeAreaBottom}>
        <ScrollView
          contentContainerStyle={style.contentContainer}
          style={style.container}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleOnRefresh}
            />
          }
        >
          <View>
            <View style={style.headerRow}>
              <GlobalText style={style.headerText}>{titleText}</GlobalText>
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
      </SafeAreaView>
    </>
  )
}

const style = StyleSheet.create({
  safeAreaTop: {
    backgroundColor: Colors.secondary10,
  },
  safeAreaBottom: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: Spacing.xSmall,
    paddingBottom: Spacing.xxHuge,
  },
  container: {
    padding: Spacing.medium,
    backgroundColor: Colors.secondary10,
  },
  headerRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginTop: Spacing.xSmall,
  },
  headerText: {
    ...Typography.header1,
    color: Colors.primaryText,
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
  },
  listContainer: {
    marginTop: Spacing.xxLarge,
  },
})

export default History
