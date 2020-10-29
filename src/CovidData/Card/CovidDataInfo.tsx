import React, { FunctionComponent } from "react"
import { useTranslation } from "react-i18next"

import { StyleSheet, View } from "react-native"

import * as CovidData from "../covidData"
import { Text } from "../../components"
import LineChart from "../LineChart"

import { Layout, Typography, Spacing, Colors } from "../../styles"

interface CovidDataInfoProps {
  data: CovidData.CovidData
  locationName: string
}

const CovidDataInfo: FunctionComponent<CovidDataInfoProps> = ({
  data,
  locationName,
}) => {
  const { t } = useTranslation()

  const lineData = CovidData.toLineChartCasesNew(data)

  const lineChartWidth =
    0.5 * (Layout.screenWidth - 2 * Spacing.medium - 2 * Spacing.medium)
  const lineChartHeight = 80

  const labelText = t("covid_data.new_cases")

  return (
    <View testID={"covid-data"}>
      <Text style={style.headerText}>
        {t("covid_data.spread_of_the_virus_in", { locationName })}
      </Text>
      <View style={style.dataContainer}>
        <View style={style.trendContainer}>
          <Text style={style.legendText}>{labelText}</Text>
        </View>
        <View style={style.chartContainer}>
          <LineChart
            lineData={lineData}
            width={lineChartWidth}
            height={lineChartHeight}
            color={Colors.accent.success100}
          />
        </View>
      </View>
    </View>
  )
}

const style = StyleSheet.create({
  headerText: {
    ...Typography.body2,
    marginBottom: Spacing.xxSmall,
  },
  dataContainer: {
    flexDirection: "row",
    marginTop: Spacing.xSmall,
    marginBottom: Spacing.medium,
  },
  trendContainer: {
    flex: 4,
  },
  chartContainer: {
    flex: 3,
  },
  legendText: {
    ...Typography.body2,
  },
})

export default CovidDataInfo
