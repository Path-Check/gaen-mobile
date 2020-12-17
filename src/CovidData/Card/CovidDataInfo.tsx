import React, { FunctionComponent } from "react"
import { StyleSheet, View } from "react-native"
import { useTranslation } from "react-i18next"

import * as CovidData from "../covidData"
import LineChart from "../LineChart"
import { Text } from "../../components"
import RiskLevelBadge from "../RiskLevelBadge"

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

  const riskLevel = CovidData.toRiskLevel(data.riskLevels.overall)

  const lineChartWidth =
    Layout.screenWidth - 2 * Spacing.medium - 2 * Spacing.medium
  const lineChartHeight = 80

  const source = data.source
  const sourceText = t("covid_data.source", { source })

  const color = CovidData.toRiskLevelColor(riskLevel)

  return (
    <View testID={"covid-data"}>
      <View style={style.headerContainer}>
        <View style={style.headerTextContainer}>
          <Text style={style.headerText}>
            {t("covid_data.overall_risk_level_in", { locationName })}
          </Text>
        </View>
        <View style={style.riskLevelBadgeContainer}>
          <RiskLevelBadge riskLevel={riskLevel} />
        </View>
      </View>
      <View style={style.chartContainer}>
        <LineChart
          lineData={newCasesData}
          width={lineChartWidth}
          height={lineChartHeight}
          color={color}
        />
      </View>
      <Text style={style.legendText}>
        {t("covid_data.past_days", { days: CovidData.numberOfDaysInTrend })}
      </Text>
      <Text style={style.sourceText}>{sourceText}</Text>
    </View>
  )
}

const style = StyleSheet.create({
  headerText: {
    ...Typography.body.x20,
    marginBottom: Spacing.xSmall,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Spacing.small,
  },
  headerTextContainer: {
    flex: 3,
  },
  riskLevelBadgeContainer: {
    flex: 2,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  chartContainer: {
    marginBottom: Spacing.xxSmall,
  },
  legendText: {
    ...Typography.body.x20,
    color: Colors.neutral.black,
  },
  sourceText: {
    ...Typography.body.x30,
    ...Typography.base.x10,
  },
})

export default CovidDataInfo
