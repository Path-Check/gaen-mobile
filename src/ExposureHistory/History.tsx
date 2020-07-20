import React, { useState } from "react"
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
import dayjs from "dayjs"

import { ExposureDatum, ExposureHistory } from "../exposureHistory"
import { RTLEnabledText } from "../components/RTLEnabledText"
import ExposureDatumDetail from "./ExposureDatumDetail"
import { DateTimeUtils } from "../utils"
import Calendar from "./Calendar"
import { Screens } from "../navigation"

import { Icons } from "../assets"
import { Buttons, Spacing, Typography, Colors } from "../styles"
import DateInfoHeader from "./DateInfoHeader"

interface HistoryProps {
  exposureHistory: ExposureHistory
}

const History = ({ exposureHistory }: HistoryProps): JSX.Element => {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const [selectedDatum, setSelectedDatum] = useState<ExposureDatum | null>(null)

  const isTodayOrBefore = (date: number) => {
    return !dayjs(date).isAfter(dayjs(), "day")
  }

  const handleOnSelectDate = (datum: ExposureDatum) => {
    if (isTodayOrBefore(datum.date)) {
      setSelectedDatum(datum)
    }
  }

  const handleOnPressMoreInfo = () => {
    navigation.navigate(Screens.MoreInfo)
  }

  const titleText = t("screen_titles.exposure_history")

  const showExposureDetail =
    selectedDatum && !DateTimeUtils.isInFuture(selectedDatum.date)

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container} alwaysBounceVertical={false}>
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
                style={styles.moreInfoButtonIcon}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.headerRow}>
            <DateInfoHeader />
          </View>
        </View>
        <View style={styles.calendarContainer}>
          <Calendar
            exposureHistory={exposureHistory}
            onSelectDate={handleOnSelectDate}
            selectedDatum={selectedDatum}
          />
        </View>
        <View style={styles.detailsContainer}>
          {selectedDatum && showExposureDetail ? (
            <ExposureDatumDetail exposureDatum={selectedDatum} />
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.medium,
    backgroundColor: Colors.primaryBackground,
  },
  headerRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: Spacing.xSmall,
  },
  headerText: {
    ...Typography.header2,
    marginRight: Spacing.medium,
  },
  moreInfoButton: {
    ...Buttons.tinyTeritiaryRounded,
    minHeight: Spacing.xHuge,
    minWidth: Spacing.xHuge,
  },
  moreInfoButtonIcon: {
    minHeight: Spacing.small,
    minWidth: Spacing.small,
  },
  calendarContainer: {
    marginTop: Spacing.xxLarge,
  },
  detailsContainer: {
    flex: 1,
    marginTop: Spacing.small,
    marginBottom: Spacing.huge,
  },
})

export default History
