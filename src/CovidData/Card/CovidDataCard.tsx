import React, { FunctionComponent } from "react"
import { useTranslation } from "react-i18next"
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native"
import { useNavigation } from "@react-navigation/native"

import { HomeStackScreens } from "../../navigation"
import { Text } from "../../components"
import SectionButton from "../../Home/SectionButton"
import { CovidDataRequest } from "../Context"
import CovidDataInfo from "./CovidDataInfo"

import {
  Iconography,
  Affordances,
  Colors,
  Typography,
  Spacing,
} from "../../styles"

type CovidDataCardProps = {
  dataRequest: CovidDataRequest
  locationName: string
}

const CovidDataCard: FunctionComponent<CovidDataCardProps> = ({
  dataRequest,
  locationName,
}) => {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const handleOnPressCard = () => {
    navigation.navigate(HomeStackScreens.CovidDataDashboard)
  }

  const determineContent = () => {
    switch (dataRequest.status) {
      case "MISSING_INFO":
        return (
          <ErrorMessage message={t("covid_data.apologies_data_unavailable")} />
        )
      case "ERROR":
        return (
          <ErrorMessage
            message={t("covid_data.error_getting_data", {
              location: locationName,
            })}
          />
        )
      case "LOADING":
        return <LoadingIndicator />
      case "SUCCESS": {
        return (
          <CovidDataInfo data={dataRequest.data} locationName={locationName} />
        )
      }
    }
  }

  return (
    <TouchableOpacity
      accessibilityLabel={t("covid_data.see_more")}
      onPress={handleOnPressCard}
      style={style.container}
    >
      <View style={style.contentContainer}>{determineContent()}</View>
      <SectionButton text={t("common.more")} />
    </TouchableOpacity>
  )
}

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

interface ErrorMessageProps {
  message: string
}

const ErrorMessage: FunctionComponent<ErrorMessageProps> = ({ message }) => {
  return <Text style={style.errorMessageText}>{message}</Text>
}

const style = StyleSheet.create({
  container: {
    ...Affordances.floatingContainer,
  },
  contentContainer: {
    marginBottom: Spacing.xSmall,
  },
  errorMessageText: {
    ...Typography.utility.error,
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
})

export default CovidDataCard
