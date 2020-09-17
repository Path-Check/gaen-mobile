import React, { FunctionComponent } from "react"
import { TouchableOpacity, View, StyleSheet, ScrollView } from "react-native"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"
import { SvgXml } from "react-native-svg"

import { useStatusBarEffect, SymptomCheckerStackScreens } from "../navigation"
import { GlobalText, StatusBar } from "../components"

import { Icons } from "../assets"
import { Layout, Colors, Spacing, Typography, Iconography } from "../styles"

const AtRiskRecommendationScreen: FunctionComponent = () => {
  useStatusBarEffect("dark-content", Colors.primaryLightBackground)
  const { t } = useTranslation()
  const navigation = useNavigation()

  const handleOnPressCancel = () => {
    navigation.navigate(SymptomCheckerStackScreens.SymptomChecker)
  }

  return (
    <>
      <StatusBar backgroundColor={Colors.primaryLightBackground} />
      <ScrollView
        style={style.container}
        contentContainerStyle={style.contentContainer}
        alwaysBounceVertical={false}
      >
        <View style={style.cancelButtonContainer}>
          <TouchableOpacity
            onPress={handleOnPressCancel}
            accessible
            accessibilityLabel={t("export.code_input_button_cancel")}
          >
            <View style={style.cancelButtonInnerContainer}>
              <SvgXml
                xml={Icons.X}
                fill={Colors.black}
                width={Iconography.xxSmall}
                height={Iconography.xxSmall}
              />
            </View>
          </TouchableOpacity>
        </View>
        <GlobalText style={style.headerText}>
          {t("symptom_checker.get_tested")}
        </GlobalText>
      </ScrollView>
    </>
  )
}

const style = StyleSheet.create({
  container: {
    backgroundColor: Colors.primaryLightBackground,
  },
  contentContainer: {
    flexGrow: 1,
    backgroundColor: Colors.primaryLightBackground,
    paddingTop: Spacing.xxxHuge,
    paddingHorizontal: Spacing.large,
    justifyContent: "center",
  },
  cancelButtonContainer: {
    position: "absolute",
    top: Spacing.medium,
    right: Spacing.medium,
    zIndex: Layout.zLevel1,
  },
  cancelButtonInnerContainer: {
    padding: Spacing.medium,
  },
  headerText: {
    ...Typography.header2,
  },
})

export default AtRiskRecommendationScreen
