import React, { FunctionComponent, useState } from "react"
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native"
import { useTranslation } from "react-i18next"

import { useSymptomLogContext } from "./SymptomLogContext"
import { GlobalText } from "../components"
import { Typography, Colors, Spacing, Iconography } from "../styles"
import { SvgXml } from "react-native-svg"
import { Icons } from "../assets"
import History from "./History"
import DaySummary from "./DaySummary"

const OverTime: FunctionComponent = () => {
  const { t } = useTranslation()
  const { dailyLogData } = useSymptomLogContext()

  type ViewSelection = "List" | "Calendar"

  const [viewSelection, setViewSelection] = useState<ViewSelection>("List")

  const noSymptomHistory = dailyLogData.length === 0

  const headerTitle =
    viewSelection === "List"
      ? t("symptom_checker.last_14_days")
      : t("symptom_checker.history")

  const headerIcon = viewSelection === "List" ? Icons.Calendar : Icons.Hamburger

  const handleOnPressToggleView = () => {
    if (viewSelection === "List") {
      setViewSelection("Calendar")
    } else {
      setViewSelection("List")
    }
  }

  return (
    <>
      <View style={style.headerContainer}>
        <GlobalText style={style.headerText}>{headerTitle}</GlobalText>
        <TouchableOpacity>
          <SvgXml
            xml={headerIcon}
            width={Iconography.xSmall}
            height={Iconography.xSmall}
            accessibilityLabel="Toggle symptom log view"
            onPress={handleOnPressToggleView}
          />
        </TouchableOpacity>
      </View>
      {viewSelection === "List" ? (
        <ScrollView
          style={style.container}
          contentContainerStyle={style.contentContainer}
          alwaysBounceVertical={false}
        >
          {noSymptomHistory ? (
            <GlobalText style={style.noSymptomHistoryText}>
              {t("symptom_checker.no_symptom_history")}
            </GlobalText>
          ) : (
            dailyLogData.map((logData) => {
              return <DaySummary key={logData.date} dayLogData={logData} />
            })
          )}
        </ScrollView>
      ) : (
        <History />
      )}
    </>
  )
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryLightBackground,
  },
  contentContainer: {
    paddingVertical: Spacing.large,
    paddingHorizontal: Spacing.large,
  },
  noSymptomHistoryText: {
    alignSelf: "center",
    ...Typography.body1,
  },
  headerContainer: {
    width: "100%",
    height: Spacing.xxHuge,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    backgroundColor: Colors.primaryLightBackground,
    paddingHorizontal: Spacing.small,
    paddingBottom: Spacing.small,
  },
  headerText: {
    ...Typography.header3,
    paddingRight: Spacing.xxLarge,
    paddingTop: Spacing.xxSmall,
  },
})

export default OverTime
