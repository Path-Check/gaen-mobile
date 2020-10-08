import React, {
  FunctionComponent,
  useEffect,
  useState,
  useCallback,
} from "react"
import { useTranslation } from "react-i18next"
import { SvgXml } from "react-native-svg"
import { StyleSheet, View } from "react-native"

import { fetchCovidDataForState } from "./covidDataAPI"
import { calculateCasesPercentageTrend } from "./covidData"

import { Text } from "../components"
import { Icons } from "../assets"

import { Colors, Typography, Spacing, Outlines } from "../styles"

type COVIDDataStateTrendProps = {
  stateAbbreviation: string
}

const COVIDDataStateTrend: FunctionComponent<COVIDDataStateTrendProps> = ({
  stateAbbreviation,
}) => {
  const { t } = useTranslation()
  const [casesPercentageTrend, setCasesPercentageTrend] = useState<
    number | null
  >(null)

  const determineCasesPercentageTrend = useCallback(async () => {
    const covidDataResponse = await fetchCovidDataForState(stateAbbreviation)
    if (covidDataResponse.kind === "success") {
      setCasesPercentageTrend(
        calculateCasesPercentageTrend(covidDataResponse.lastWeekCovidData),
      )
    }
  }, [stateAbbreviation])

  useEffect(() => {
    determineCasesPercentageTrend()
  }, [determineCasesPercentageTrend])

  if (casesPercentageTrend === null) {
    return null
  }

  const trendPercentageValue = `${Math.abs(casesPercentageTrend)}%`

  const trendInfo =
    casesPercentageTrend > 0
      ? {
          text: t("covid_data.cases_are_up"),
          indicator: <SvgXml xml={Icons.ChevronUp} fill={Colors.white} />,
        }
      : {
          text: t("covid_data.cases_are_down"),
          indicator: (
            <SvgXml
              xml={Icons.ChevronUp}
              fill={Colors.white}
              style={style.downwardTrendChevron}
            />
          ),
        }

  return (
    <View style={style.container}>
      <View style={style.percentageContainer}>
        <View style={style.trendArrowContainer}>{trendInfo.indicator}</View>
        <Text style={style.percentageText}>{trendPercentageValue}</Text>
      </View>
      <View style={style.infoContainer}>
        <Text style={style.headerText}>{stateAbbreviation.toUpperCase()}</Text>
        <Text style={style.subHeaderText}>{trendInfo.text}</Text>
      </View>
    </View>
  )
}

const style = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerText: {
    ...Typography.header4,
    ...Typography.bold,
  },
  subHeaderText: {
    ...Typography.body3,
  },
  percentageContainer: {
    ...Outlines.ovalBorder,
    borderWidth: 0,
    backgroundColor: Colors.primary110,
    paddingHorizontal: Spacing.medium,
    paddingVertical: Spacing.xSmall,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  percentageText: {
    ...Typography.body1,
    color: Colors.white,
  },
  infoContainer: {
    ...Typography.body1,
  },
  trendArrowContainer: {
    paddingRight: Spacing.xxSmall,
  },
  downwardTrendChevron: {
    transform: [{ rotate: "180deg" }],
  },
})

export default COVIDDataStateTrend
