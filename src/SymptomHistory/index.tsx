import React, { FunctionComponent } from "react"
import {
  ScrollView,
  Share,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native"
import { useTranslation } from "react-i18next"

import {
  DAYS_AFTER_LOG_IS_CONSIDERED_STALE,
  useSymptomHistoryContext,
} from "./SymptomHistoryContext"
import { SymptomEntry } from "./symptomHistory"
import { Text, StatusBar } from "../components"
import { useStatusBarEffect } from "../navigation"
import SymptomEntryListItem from "./SymptomEntryListItem"
import SymptomHistoryFormatter from "./Share/SymptomHistoryFormatter"

import { Buttons, Colors, Spacing, Typography } from "../styles"

const SymptomHistory: FunctionComponent = () => {
  useStatusBarEffect("dark-content", Colors.background.primaryLight)
  const { t } = useTranslation()
  const { symptomHistory } = useSymptomHistoryContext()

  const handleOnPressShareHistory = async () => {
    const message = SymptomHistoryFormatter.forSharing(t, symptomHistory)

    try {
      await Share.share({
        message,
      })
    } catch (error) {
      throw new Error(error)
    }
  }

  return (
    <View style={style.outerContainer}>
      <StatusBar backgroundColor={Colors.background.primaryLight} />
      <ScrollView
        style={style.container}
        contentContainerStyle={style.contentContainer}
        alwaysBounceVertical={false}
      >
        <Text style={style.headerText}>
          {t("symptom_history.symptom_history")}
        </Text>

        <Text style={style.subHeaderText}>
          {t("symptom_history.to_protect_your_privacy", {
            days: DAYS_AFTER_LOG_IS_CONSIDERED_STALE,
          })}
        </Text>

        {symptomHistory.map((entry: SymptomEntry) => {
          return <SymptomEntryListItem key={entry.date} entry={entry} />
        })}
      </ScrollView>
      <TouchableOpacity
        style={style.shareButton}
        onPress={handleOnPressShareHistory}
        testID="shareButton"
      >
        <Text style={style.shareButtonText}>
          {t("symptom_history.share_history")}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

const style = StyleSheet.create({
  outerContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background.primaryLight,
  },
  contentContainer: {
    paddingVertical: Spacing.medium,
    paddingHorizontal: Spacing.medium,
  },
  headerText: {
    ...Typography.header.x60,
    ...Typography.style.bold,
    marginBottom: Spacing.xxxSmall,
  },
  subHeaderText: {
    ...Typography.body.x30,
    marginBottom: Spacing.large,
  },
  shareButton: {
    ...Buttons.fixedBottom.base,
  },
  shareButtonText: {
    ...Typography.button.fixedBottom,
  },
})

export default SymptomHistory
