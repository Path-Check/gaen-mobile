import React, {
  FunctionComponent,
  useEffect,
  useState,
  useCallback,
} from "react"
import { useTranslation } from "react-i18next"
import { StyleSheet, View } from "react-native"

import { Text } from "../components"
import { CovidData, fetchCovidDataForState } from "./covidDataAPI"
import { beginningOfDay } from "../utils/dateTime"

import { Typography, Colors, Outlines, Spacing } from "../styles"

type StateDataProps = {
  stateAbbreviation: string
}

const StateData: FunctionComponent<StateDataProps> = ({
  stateAbbreviation,
}) => {
  const { t } = useTranslation()
  const [todayCovidData, setTodayCovidData] = useState<CovidData | null>(null)

  const getTodayCovidData = useCallback(async () => {
    const todayDate = beginningOfDay(Date.now())
    const todayCovidDataRequestResponse = await fetchCovidDataForState(
      stateAbbreviation,
      todayDate,
    )
    if (todayCovidDataRequestResponse.kind === "success") {
      setTodayCovidData(todayCovidDataRequestResponse.covidData)
    }
  }, [stateAbbreviation])

  useEffect(() => {
    getTodayCovidData()
  }, [getTodayCovidData])

  if (todayCovidData === null) {
    return null
  }

  return (
    <View>
      <View style={style.headerContainer}>
        <Text style={style.headerText}>{t("covid_data.covid_data")}</Text>
        <Text style={style.headerText}>{stateAbbreviation.toUpperCase()}</Text>
      </View>
      <View style={style.labelAndDataContainer}>
        <Text style={style.dataText}>{t("covid_data.cases_today")}</Text>
        <Text style={style.dataText}>{todayCovidData.positiveIncrease}</Text>
      </View>
      <View style={style.labelAndDataContainer}>
        <Text style={style.dataText}>{t("covid_data.deaths_today")}</Text>
        <Text style={style.dataText}>{todayCovidData.deathIncrease}</Text>
      </View>
      <View style={style.labelAndDataContainer}>
        <Text style={style.dataText}>{t("covid_data.total_cases")}</Text>
        <Text style={style.dataText}>{todayCovidData.positive}</Text>
      </View>
      <View style={style.labelAndDataContainer}>
        <Text style={style.dataText}>{t("covid_data.total_deaths")}</Text>
        <Text style={style.dataText}>{todayCovidData.death}</Text>
      </View>
    </View>
  )
}

const style = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: Outlines.hairline,
    borderBottomColor: Colors.neutral30,
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
