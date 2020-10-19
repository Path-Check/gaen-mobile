import React, { FunctionComponent } from "react"
import {
  ScrollView,
  Share,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native"
import { useTranslation } from "react-i18next"
import { SvgXml } from "react-native-svg"

import {
  DAYS_AFTER_LOG_IS_CONSIDERED_STALE,
  useSymptomHistoryContext,
} from "./SymptomHistoryContext"
import { SymptomEntry } from "./symptomHistory"
import { Text, StatusBar } from "../components"
import { useStatusBarEffect } from "../navigation"
import SymptomEntryListItem from "./SymptomEntryListItem"
import Formatter from "./Formatter"

import { Colors, Spacing, Typography, Iconography } from "../styles"
import { Icons } from "../assets"

const SymptomHistory: FunctionComponent = () => {
  useStatusBarEffect("dark-content", Colors.primaryLightBackground)
  const { t } = useTranslation()
  const { symptomHistory } = useSymptomHistoryContext()

  const handleOnPressShareHistory = async () => {
    const message = Formatter.forSharing(t, symptomHistory)

    if (message) {
      try {
        await Share.share({
          message,
        })
      } catch (error) {
        throw new Error(error)
      }
    }
  }

  return (
    <View style={style.outerContainer}>
      <StatusBar backgroundColor={Colors.primaryLightBackground} />
      <ScrollView
        style={style.container}
        contentContainerStyle={style.contentContainer}
        alwaysBounceVertical={false}
      >
        <View style={style.headerContainer}>
          <Text style={style.headerText}>
            {t("symptom_history.symptom_history")}
          </Text>

          <TouchableOpacity
            accessibilityLabel={t("symptom_history.share_history")}
            style={style.shareButton}
            onPress={handleOnPressShareHistory}
          >
            <SvgXml
              xml={Icons.Share}
              fill={Colors.primary100}
              width={Iconography.xxSmall}
              height={Iconography.xxSmall}
            />
          </TouchableOpacity>
        </View>
        <Text style={style.subHeaderText}>
          {t("symptom_history.to_protect_your_privacy", {
            days: DAYS_AFTER_LOG_IS_CONSIDERED_STALE,
          })}
        </Text>

        {symptomHistory.map((entry: SymptomEntry) => {
          return <SymptomEntryListItem key={entry.date} entry={entry} />
        })}
      </ScrollView>
    </View>
  )
}

const style = StyleSheet.create({
  outerContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.primaryLightBackground,
  },
  contentContainer: {
    paddingVertical: Spacing.large,
    paddingHorizontal: Spacing.medium,
  },
  headerContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: {
    ...Typography.header1,
    ...Typography.bold,
    marginBottom: Spacing.xxxSmall,
  },
  shareButton: {
    paddingBottom: Spacing.xxxSmall,
  },
  subHeaderText: {
    ...Typography.body1,
    marginBottom: Spacing.large,
  },
})

export default SymptomHistory
