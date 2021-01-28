import React, { FunctionComponent } from "react"
import { useTranslation } from "react-i18next"
import { StyleSheet, View } from "react-native"

import { Text } from "../../components"
import * as CovidData from "../covidData"
import RiskLevelBadge from "../RiskLevelBadge"

import { Typography, Spacing } from "../../styles"

type StateDataProps = {
  data: CovidData.CovidData
}

const StateData: FunctionComponent<StateDataProps> = ({ data }) => {
  const { t } = useTranslation()

  const {
    metrics: { caseDensity, infectionRate, testPositivityRatio },
    state: stateAbbreviation,
    riskLevels,
  } = data

  const {
    caseDensity: rawCaseDensityRiskLevel,
    infectionRate: rawInfectionRateRiskLevel,
    testPositivityRatio: rawTestPositivityRatioRiskLevel,
  } = riskLevels

  const caseDensityRiskLevel = CovidData.toRiskLevel(rawCaseDensityRiskLevel)
  const infectionRateRiskLevel = CovidData.toRiskLevel(
    rawInfectionRateRiskLevel,
  )
  const testPositivityRatioRiskLevel = CovidData.toRiskLevel(
    rawTestPositivityRatioRiskLevel,
  )

  const casesDensityText = caseDensity.toFixed(1)
  const infectionRateText = infectionRate.toFixed(2)
  const testPositivityRatioText = (testPositivityRatio * 100).toFixed(1) + "%"
  const { source } = data
  const sourceText = t("covid_data.source", { source })

  const metricData: MetricProps[] = [
    {
      riskLevel: caseDensityRiskLevel,
      dataText: casesDensityText,
      labelText: t("covid_data.daily_new_cases"),
    },
    {
      riskLevel: infectionRateRiskLevel,
      dataText: infectionRateText,
      labelText: t("covid_data.infection_rate"),
    },
    {
      riskLevel: testPositivityRatioRiskLevel,
      dataText: testPositivityRatioText,
      labelText: t("covid_data.positive_test_rate"),
    },
  ]

  return (
    <View>
      <Text style={style.headerText}>{t("covid_data.covid_stats")}</Text>
      <Text style={style.subheaderText}>{stateAbbreviation.toUpperCase()}</Text>

      <View style={style.metricsContainer}>
        {metricData.map((metricProps: MetricProps) => {
          return (
            <View key={metricProps.dataText}>
              <Metric {...metricProps} />
            </View>
          )
        })}
      </View>

      <Text style={style.sourceText}>{sourceText}</Text>
    </View>
  )
}

interface MetricProps {
  riskLevel: CovidData.RiskLevel
  dataText: string
  labelText: string
}

const Metric: FunctionComponent<MetricProps> = ({
  riskLevel,
  dataText,
  labelText,
}) => {
  const dataTextStyle = {
    ...style.dataText,
    color: CovidData.toRiskLevelColor(riskLevel),
  }

  return (
    <View style={style.metricContainer}>
      <View style={style.riskLevelBadgeContainer}>
        <RiskLevelBadge riskLevel={riskLevel} />
      </View>
      <View style={style.dataContainer}>
        <View style={style.dataTextContainer}>
          <Text style={dataTextStyle}>{dataText}</Text>
        </View>
        <View style={style.labelContainer}>
          <Text style={style.labelText}>{labelText}</Text>
        </View>
      </View>
    </View>
  )
}

const style = StyleSheet.create({
  headerText: {
    ...Typography.header.x50,
    marginBottom: Spacing.xxxSmall,
  },
  subheaderText: {
    ...Typography.body.x30,
    marginBottom: Spacing.xxxSmall,
  },
  riskLevelBadgeContainer: {
    flex: 1,
    alignItems: "flex-start",
  },
  metricsContainer: {
    marginBottom: Spacing.huge,
  },
  metricContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: Spacing.small,
  },
  dataContainer: {
    flex: 3,
    marginLeft: Spacing.xxSmall,
  },
  dataTextContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
  },
  dataText: {
    ...Typography.header.x30,
    ...Typography.style.monospace,
  },
  labelContainer: {
    flex: 3,
  },
  labelText: {
    ...Typography.body.x20,
  },
  sourceText: {
    ...Typography.body.x30,
    ...Typography.base.x10,
  },
})

export default StateData
