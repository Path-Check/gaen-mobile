import React, { FunctionComponent } from "react"
import { ActivityIndicator, StyleSheet, View } from "react-native"
import { useTranslation } from "react-i18next"

import CovidDataStateTrend from "./CovidDataStateTrend"
import { Text } from "../components"
import {
  CovidDataRequestStatus,
  useCovidDataContext,
} from "../CovidDataContext"

import {
  Affordances,
  Colors,
  Iconography,
  Spacing,
  Typography,
} from "../styles"

const LoadingIndicator = () => {
  return (
    <View style={style.activityIndicatorContainer}>
      <ActivityIndicator
        size={"large"}
        color={Colors.neutral.shade100}
        style={style.activityIndicator}
        testID={"loading-indicator"}
      />
    </View>
  )
}

const CovidDataClip: FunctionComponent = () => {
  const { t } = useTranslation()
  const {
    stateAbbreviation,
    covidDataRequest: { trendReferenceData, collectionForTrend, status },
  } = useCovidDataContext()

  const dataClipContent = () => {
    switch (status) {
      case CovidDataRequestStatus.LOADING:
        return <LoadingIndicator />
      case CovidDataRequestStatus.ERROR:
        return (
          <Text style={style.errorMessageText}>
            {t("covid_data.error_getting_data", {
              location: stateAbbreviation,
            })}
          </Text>
        )
      case CovidDataRequestStatus.SUCCESS:
        return (
          <CovidDataStateTrend
            trendReferenceData={trendReferenceData}
            collectionForTrend={collectionForTrend}
            stateAbbreviation={stateAbbreviation}
          />
        )
      case CovidDataRequestStatus.MISSING_INFO:
        return (
          <Text style={style.errorMessageText}>
            {t("covid_data.apologies_data_unavailable")}
          </Text>
        )
    }
  }

  return <View style={style.dataContainer}>{dataClipContent()}</View>
}

const style = StyleSheet.create({
  dataContainer: {
    ...Affordances.floatingContainer,
  },
  activityIndicatorContainer: {
    flex: 1,
    alignItems: "center",
  },
  activityIndicator: {
    paddingVertical: Spacing.small,
    width: Iconography.xxSmall,
    height: Iconography.xxSmall,
  },
  errorMessageText: {
    ...Typography.body1,
    color: Colors.text.error,
  },
})

export default CovidDataClip
