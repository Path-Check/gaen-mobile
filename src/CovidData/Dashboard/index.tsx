import React, { FunctionComponent } from "react"
import {
  View,
  Linking,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native"
import { useTranslation } from "react-i18next"
import StaticSafeAreaInsets from "react-native-static-safe-area-insets"

import { useConfigurationContext } from "../../ConfigurationContext"
import { Text } from "../../components"
import { useCovidDataContext } from "../Context"
import StateData from "./StateData"

import { Typography, Buttons, Colors, Spacing } from "../../styles"

const CovidDataDashboard: FunctionComponent = () => {
  const { t } = useTranslation()

  const {
    request: { status, data },
  } = useCovidDataContext()
  const { healthAuthorityCovidDataUrl } = useConfigurationContext()

  if (status === "MISSING_INFO") {
    return null
  }

  const handleOnPressLearnMore = () => {
    if (healthAuthorityCovidDataUrl) {
      Linking.openURL(healthAuthorityCovidDataUrl)
    }
  }

  return (
    <View style={style.outerContainer}>
      <ScrollView
        style={style.container}
        contentContainerStyle={style.contentContainer}
        alwaysBounceVertical={false}
      >
        <StateData data={data} />
      </ScrollView>

      {healthAuthorityCovidDataUrl ? (
        <TouchableOpacity
          style={style.button}
          onPress={handleOnPressLearnMore}
          testID="shareButton"
        >
          <Text style={style.buttonText}>{t("common.learn_more")}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  )
}

const style = StyleSheet.create({
  outerContainer: {
    flex: 1,
  },
  container: {
    backgroundColor: Colors.background.primaryLight,
  },
  contentContainer: {
    paddingTop: Spacing.medium,
    paddingBottom: Spacing.xxxLarge,
    paddingHorizontal: Spacing.medium,
    backgroundColor: Colors.background.primaryLight,
  },
  button: {
    ...Buttons.fixedBottom.base,
    paddingBottom: StaticSafeAreaInsets.safeAreaInsetsBottom + Spacing.xSmall,
  },
  buttonText: {
    ...Typography.button.fixedBottom,
  },
})

export default CovidDataDashboard
