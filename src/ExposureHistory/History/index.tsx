import React, { FunctionComponent } from "react"
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native"
import { SvgXml } from "react-native-svg"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"

import { ExposureDatum } from "../../exposure"
import { GlobalText } from "../../components/GlobalText"

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

  const handleOnPressMoreInfo = () => {
    navigation.navigate(Screens.MoreInfo)
  }

  const showExposureHistory = exposures.length > 0

  const titleText = t("screen_titles.exposure_history")

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors.primaryLightBackground }}
    >
      <ScrollView
        contentContainerStyle={style.contentContainer}
        style={style.container}
        alwaysBounceVertical={false}
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
  )
}

const style = StyleSheet.create({
  contentContainer: {
    paddingTop: Spacing.xSmall,
    paddingBottom: Spacing.xxHuge,
  },
  container: {
    padding: Spacing.medium,
    backgroundColor: Colors.primaryLightBackground,
  },
  headerRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginTop: Spacing.xSmall,
  },
  headerText: {
    ...Typography.header1,
    color: Colors.black,
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
