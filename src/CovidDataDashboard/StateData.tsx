import React, { FunctionComponent } from "react"
import { useTranslation } from "react-i18next"
import { StyleSheet, View } from "react-native"

import { Text } from "../components"
import { CovidData } from "./covidDataAPI"

import { Typography, Colors, Outlines, Spacing } from "../styles"

type StateDataProps = {
  todayCovidData: CovidData
  stateAbbreviation: string
}

const StateData: FunctionComponent<StateDataProps> = ({
  todayCovidData,
  stateAbbreviation,
}) => {
  const { t } = useTranslation()

  return (
    <View>
      <View style={style.headerContainer}>
        <Text style={style.headerText}>{t("covid_data.covid_data")}</Text>
        <Text style={style.headerText}>{stateAbbreviation.toUpperCase()}</Text>
      </View>
      <View style={style.labelAndDataContainer}>
        <Text style={style.dataText}>{t("covid_data.cases_today")}</Text>
        <Text style={style.dataText}>
          {todayCovidData.peoplePositiveNewCasesCt}
        </Text>
      </View>
      <View style={style.labelAndDataContainer}>
        <Text style={style.dataText}>{t("covid_data.deaths_today")}</Text>
        <Text style={style.dataText}>{todayCovidData.peopleDeathNewCt}</Text>
      </View>
      <View style={style.labelAndDataContainer}>
        <Text style={style.dataText}>{t("covid_data.total_cases")}</Text>
        <Text style={style.dataText}>
          {todayCovidData.peoplePositiveCasesCt}
        </Text>
      </View>
      <View style={style.labelAndDataContainer}>
        <Text style={style.dataText}>{t("covid_data.total_deaths")}</Text>
        <Text style={style.dataText}>{todayCovidData.peopleDeathCt}</Text>
      </View>
    </View>
  )
}

const style = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: Outlines.hairline,
    borderBottomColor: Colors.neutral.shade30,
  },
  headerText: {
    ...Typography.header4,
    ...Typography.bold,
    paddingBottom: Spacing.xSmall,
  },
  labelAndDataContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: Spacing.xxSmall,
  },
  dataText: {
    ...Typography.body1,
  },
})

export default StateData
