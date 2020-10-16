import React, { FunctionComponent } from "react"
import { ScrollView, StyleSheet, View } from "react-native"
import { useTranslation } from "react-i18next"

import {
  DAYS_AFTER_LOG_IS_CONSIDERED_STALE,
  useSymptomHistoryContext,
} from "./SymptomHistoryContext"
import { SymptomEntry } from "./symptomHistory"
import { Text, StatusBar } from "../components"
import { useStatusBarEffect } from "../navigation"
import SymptomEntryListItem from "./SymptomEntryListItem"

import { Typography, Colors, Spacing } from "../styles"

const SymptomHistory: FunctionComponent = () => {
  useStatusBarEffect("dark-content", Colors.primaryLightBackground)
  const { t } = useTranslation()
  const { symptomHistory } = useSymptomHistoryContext()

  return (
    <View style={style.outerContainer}>
      <StatusBar backgroundColor={Colors.primaryLightBackground} />
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
  headerText: {
    ...Typography.header1,
    ...Typography.bold,
    marginBottom: Spacing.xxxSmall,
  },
  subHeaderText: {
    ...Typography.body1,
    marginBottom: Spacing.large,
  },
})

export default SymptomHistory
