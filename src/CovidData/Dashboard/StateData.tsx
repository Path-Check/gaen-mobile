import React, { FunctionComponent } from "react"
import { useTranslation } from "react-i18next"
import { StyleSheet, View } from "react-native"

import { Text } from "../../components"
import * as CovidData from "../covidData"

import {
  Typography,
  Colors,
  Outlines,
  Spacing,
  Affordances,
} from "../../styles"

type StateDataProps = {
  data: CovidData.CovidData
}

const StateData: FunctionComponent<StateDataProps> = ({ data }) => {
  const { t } = useTranslation()

  const {
    metrics: { caseDensity, infectionRate, testPositivityRatio },
    state: stateAbbreviation,
  } = data

  const casesPer100kText = caseDensity.toFixed(1)
  const infectionRateText = infectionRate.toFixed(2)
  const positiveTestRateText = (testPositivityRatio * 100).toFixed(1) + "%"
  const source = data.source
  const sourceText = t("covid_data.source", { source })

  return (
    <View style={style.container}>
      <View style={style.headerContainer}>
        <Text style={style.headerText}>{stateAbbreviation.toUpperCase()}</Text>
      </View>
      <View style={style.metricsContainer}>
        <View style={style.metricContainer}>
          <View style={style.labelContainer}>
            <Text style={style.labelText}>
              {t("covid_data.daily_new_cases")}
            </Text>
          </View>
          <View style={style.dataContainer}>
            <Text style={style.dataText}>{casesPer100kText}</Text>
            <View style={style.unitContainer}>
              <Text style={style.unitText}>{t("covid_data.per_100k")}</Text>
            </View>
          </View>
        </View>
        <View style={style.metricContainer}>
          <View style={style.labelContainer}>
            <Text style={style.labelText}>
              {t("covid_data.infection_rate")}
            </Text>
          </View>
          <View style={style.dataContainer}>
            <Text style={style.dataText}>{infectionRateText}</Text>
          </View>
        </View>
        <View style={style.metricContainer}>
          <View style={style.labelContainer}>
            <Text style={style.labelText}>
              {t("covid_data.positive_test_rate")}
            </Text>
          </View>
          <View style={style.dataContainer}>
            <Text style={style.dataText}>{positiveTestRateText}</Text>
          </View>
        </View>
      </View>
      <Text style={style.sourceText}>{sourceText}</Text>
    </View>
  )
}

const style = StyleSheet.create({
  container: {
    ...Affordances.floatingContainer,
  },
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
  metricsContainer: {
    borderBottomWidth: Outlines.hairline,
    borderBottomColor: Colors.neutral.shade30,
    paddingBottom: Spacing.large,
  },
  metricContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: Spacing.small,
  },
  labelContainer: {
    flex: 2,
  },
  labelText: {
    ...Typography.header.x20,
  },
  dataContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dataText: {
    ...Typography.header.x40,
    marginRight: Spacing.xSmall,
  },
  unitContainer: {
    width: 40,
  },
  unitText: {
    ...Typography.body.x10,
  },
  sourceText: {
    ...Typography.body.x30,
    ...Typography.base.x10,
  },
})

export default StateData
