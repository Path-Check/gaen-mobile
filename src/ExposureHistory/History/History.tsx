import React, { FunctionComponent } from "react"
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  SafeAreaView,
} from "react-native"
import { SvgXml } from "react-native-svg"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"

import { ExposureDatum } from "../../exposure"
import { RTLEnabledText } from "../../components/RTLEnabledText"

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
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        style={styles.container}
        alwaysBounceVertical={false}
      >
        <View>
          <View style={styles.headerRow}>
            <RTLEnabledText style={styles.headerText}>
              {titleText}
            </RTLEnabledText>
            <TouchableOpacity
              onPress={handleOnPressMoreInfo}
              style={styles.moreInfoButton}
            >
              <SvgXml
                xml={Icons.QuestionMark}
                accessible
                accessibilityLabel={t("label.question_icon")}
                style={styles.moreInfoButtonIcon}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.subheaderRow}>
            <DateInfoHeader lastDetectionDate={lastDetectionDate} />
          </View>
        </View>
        <View style={styles.listContainer}>
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

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: Spacing.xxHuge,
  },
  container: {
    padding: Spacing.medium,
    backgroundColor: Colors.primaryBackground,
  },
  headerRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginTop: Spacing.xSmall,
  },
  headerText: {
    ...Typography.header2,
    color: Colors.black,
    marginRight: Spacing.medium,
  },
  moreInfoButton: {
    ...Buttons.tinyTeritiaryRounded,
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
