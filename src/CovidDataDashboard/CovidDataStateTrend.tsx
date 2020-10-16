import React, { FunctionComponent, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { SvgXml } from "react-native-svg"
import { StyleSheet, TouchableOpacity, View } from "react-native"
import { useNavigation } from "@react-navigation/native"

import { calculateCasesPercentageTrend } from "./covidData"
import { CovidData } from "./covidDataAPI"
import { HomeStackScreens } from "../navigation"

import { Text } from "../components"
import { Icons } from "../assets"

import { Colors, Typography, Spacing, Outlines, Iconography } from "../styles"

type CovidDataStateTrendProps = {
  trendReferenceData: CovidData
  collectionForTrend: CovidData[]
  stateAbbreviation: string
}

const CovidDataStateTrend: FunctionComponent<CovidDataStateTrendProps> = ({
  trendReferenceData,
  collectionForTrend,
  stateAbbreviation,
}) => {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const [casesPercentageTrend, setCasesPercentageTrend] = useState<
    number | null
  >(null)

  const handleOnPressDataClip = () => {
    navigation.navigate(HomeStackScreens.CovidDataDashboard)
  }

  useEffect(() => {
    setCasesPercentageTrend(
      calculateCasesPercentageTrend(trendReferenceData, collectionForTrend),
    )
  }, [trendReferenceData, collectionForTrend])

  if (casesPercentageTrend === null) {
    return null
  }

  const trendPercentageValue = `${Math.abs(casesPercentageTrend)}%`

  const trendInfo =
    casesPercentageTrend > 0
      ? {
          text: t("covid_data.up_from_last_week"),
          indicator: <SvgXml xml={Icons.ChevronUp} fill={Colors.black} />,
        }
      : {
          text: t("covid_data.down_from_last_week"),
          indicator: <SvgXml xml={Icons.ChevronDown} fill={Colors.black} />,
        }

  return (
    <TouchableOpacity
      accessibilityLabel={t("covid_data.see_more")}
      onPress={handleOnPressDataClip}
      style={style.container}
    >
      <View>
        <Text style={style.sectionHeaderText}>
          {t("covid_data.covid_stats_in", {
            location: stateAbbreviation.toUpperCase(),
          })}
        </Text>
        <View style={style.dataContainer}>
          <View style={style.percentageContainer}>
            <View style={style.trendArrowContainer}>{trendInfo.indicator}</View>
            <Text style={style.percentageText}>{trendPercentageValue}</Text>
          </View>
          <View style={style.infoContainer}>
            <Text style={style.headerText}>{t("covid_data.new_cases")}</Text>
            <Text style={style.subHeaderText}>{trendInfo.text}</Text>
          </View>
        </View>
      </View>
      <View style={style.chevronContainer}>
        <SvgXml
          xml={Icons.ChevronRight}
          fill={Colors.neutral75}
          width={Iconography.xxSmall}
          height={Iconography.xxSmall}
        />
      </View>
    </TouchableOpacity>
  )
}

const style = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: {
    ...Typography.header4,
    ...Typography.base,
  },
  subHeaderText: {
    ...Typography.body3,
  },
  percentageContainer: {
    borderRadius: Outlines.baseBorderRadius,
    borderWidth: 0,
    backgroundColor: Colors.secondary50,
    paddingHorizontal: Spacing.small,
    paddingVertical: Spacing.xSmall,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  percentageText: {
    ...Typography.body1,
    ...Typography.bold,
    color: Colors.black,
  },
  infoContainer: {
    marginLeft: Spacing.small,
  },
  trendArrowContainer: {
    paddingRight: Spacing.xxSmall,
  },
  chevronContainer: {
    paddingLeft: Spacing.medium,
  },
  sectionHeaderText: {
    ...Typography.header3,
    marginBottom: Spacing.xxSmall,
    color: Colors.black,
  },
  dataContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
})

export default CovidDataStateTrend
