import React, { FunctionComponent } from "react"
import { useTranslation } from "react-i18next"
import { StyleSheet, View } from "react-native"

import { Text } from "../../components"
import { CovidDatum } from "../covidData"

import { Typography, Colors, Outlines, Spacing } from "../../styles"

type StateDataProps = {
  todayCovidData: CovidDatum
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
        <Text style={style.dataText}>{todayCovidData.positiveCasesNew}</Text>
      </View>
      <View style={style.labelAndDataContainer}>
        <Text style={style.dataText}>{t("covid_data.deaths_today")}</Text>
        <Text style={style.dataText}>{todayCovidData.deathsNew}</Text>
      </View>
      <View style={style.labelAndDataContainer}>
        <Text style={style.dataText}>{t("covid_data.total_cases")}</Text>
        <Text style={style.dataText}>{todayCovidData.positiveCasesTotal}</Text>
      </View>
      <View style={style.labelAndDataContainer}>
        <Text style={style.dataText}>{t("covid_data.total_deaths")}</Text>
        <Text style={style.dataText}>{todayCovidData.deathsTotal}</Text>
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
    ...Typography.header.x30,
    ...Typography.style.bold,
    paddingBottom: Spacing.xSmall,
  },
  labelAndDataContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: Spacing.xxSmall,
  },
  dataText: {
    ...Typography.body.x30,
  },
})

export default StateData
