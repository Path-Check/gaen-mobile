import React, { FunctionComponent } from "react"
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  SafeAreaView,
  Text,
} from "react-native"
import { SvgXml } from "react-native-svg"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"

import { RTLEnabledText } from "../components/RTLEnabledText"
import ExposureList from "./ExposureList"
import DateInfoHeader from "./DateInfoHeader"

import { Icons } from "../assets"
import { Screens } from "../navigation"
import { Buttons, Spacing, Typography, Colors } from "../styles"

type Posix = number

interface HistoryProps {
  lastDetectionDate: Posix | null
}

const History: FunctionComponent<HistoryProps> = ({ lastDetectionDate }) => {
  const { t } = useTranslation()
  const navigation = useNavigation()

  const handleOnPressMoreInfo = () => {
    navigation.navigate(Screens.MoreInfo)
  }

  const titleText = t("screen_titles.exposure_history")
  const subtitleText = t("exposure_history.keep_track_of_exposures")

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
                accessible
                accessibilityLabel={t("label.question_icon")}
                style={styles.moreInfoButtonIcon}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.headerRow}>
            <DateInfoHeader lastDetectionDate={lastDetectionDate} />
          </View>
          <View>
            <Text>{subtitleText}</Text>
          </View>
        </View>
        <View style={styles.listContainer}>
          <ExposureList />
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
  listContainer: {
    marginTop: Spacing.xxLarge,
  },
})

export default History
