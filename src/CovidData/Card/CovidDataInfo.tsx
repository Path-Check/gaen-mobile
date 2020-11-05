import React, { FunctionComponent } from "react"
import { StyleSheet, View } from "react-native"
import { useTranslation } from "react-i18next"
import regression from "regression"

import * as CovidData from "../covidData"
import LineChart from "../LineChart"
import { Text } from "../../components"

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

  const newCasesData = CovidData.toLineChartCasesNew(data.timeseries)

  const toPoint = (newCaseDatum: number, idx: number): [number, number] => {
    return [idx, newCaseDatum]
  }
  const newCasesPoints = newCasesData.map(toPoint)
  const result = regression.linear(newCasesPoints)
  const trend = result.equation[0]

  const lineChartWidth =
    0.5 * (Layout.screenWidth - 2 * Spacing.medium - 2 * Spacing.medium)
  const lineChartHeight = 80

  const trendText =
    trend > 0 ? t("covid_data.trending_up") : t("covid_data.trending_down")
  const trendColor =
    trend > 0 ? Colors.accent.warning100 : Colors.accent.success100

  const source = data.source
  const sourceText = t("covid_data.source", { source })
  const labelText = t("covid_data.new_cases")

  return (
    <View testID={"covid-data"}>
      <Text style={style.headerText}>
        {t("covid_data.spread_of_the_virus_in", { locationName })}
      </Text>
      <View style={style.dataContainer}>
        <View style={style.trendContainer}>
          <Text style={{ ...style.trendText, color: trendColor }}>
            {trendText}
          </Text>
          <Text style={style.sourceText}>{t("covid_data.past_7_days")}</Text>
          <Text style={style.legendText}>{labelText}</Text>
        </View>
        <View style={style.chartContainer}>
          <LineChart
            lineData={newCasesData}
            width={lineChartWidth}
            height={lineChartHeight}
            color={trendColor}
          />
        </View>
      </View>
      <Text style={style.sourceText}>{sourceText}</Text>
    </View>
  )
}

const style = StyleSheet.create({
  headerText: {
    ...Typography.body.x20,
  },
  dataContainer: {
    flexDirection: "row",
  },
  trendContainer: {
    flex: 4,
    justifyContent: "center",
  },
  chartContainer: {
    flex: 3,
  },
  legendText: {
    ...Typography.body.x20,
  },
  trendText: {
    ...Typography.header.x30,
    ...Typography.style.semibold,
    lineHeight: Typography.lineHeight.x40,
  },
  sourceText: {
    ...Typography.body.x30,
    ...Typography.base.x10,
  },
})

export default CovidDataInfo
