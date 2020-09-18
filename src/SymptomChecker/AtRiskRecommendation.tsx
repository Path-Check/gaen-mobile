import React, { FunctionComponent } from "react"
import {
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView,
  Image,
  Linking,
} from "react-native"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"
import { SvgXml } from "react-native-svg"

import { useStatusBarEffect, SymptomCheckerStackScreens } from "../navigation"
import { GlobalText, StatusBar, Button } from "../components"

import { Icons, Images } from "../assets"
import { Layout, Colors, Spacing, Typography, Iconography } from "../styles"

const AtRiskRecommendationScreen: FunctionComponent = () => {
  useStatusBarEffect("dark-content", Colors.primaryLightBackground)
  const { t } = useTranslation()
  const navigation = useNavigation()

  const handleOnPressCancel = () => {
    navigation.navigate(SymptomCheckerStackScreens.SymptomChecker)
  }

  const handleOnPressFindTestCenter = () => {
    Linking.openURL("https://google.com")
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
        <Image
          source={Images.PersonFindingLocation}
          accessible
          accessibilityLabel={t(
            "symptom_checker.person_finding_location_label",
          )}
          style={style.image}
        />
        <GlobalText style={style.headerText}>
          {t("symptom_checker.guidance")}
        </GlobalText>
        <View style={style.bodyTextContainer}>
          <GlobalText style={style.bodyText}>
            {t("symptom_checker.sorry_not_feeling_well")}
          </GlobalText>
          <GlobalText style={style.bodyText}>
            {t("symptom_checker.get_tested")}
          </GlobalText>
        </View>
        <Button
          label={t("symptom_checker.find_a_test_center_nearby")}
          onPress={handleOnPressFindTestCenter}
          customButtonStyle={style.button}
          customButtonInnerStyle={style.buttonInner}
          hasRightArrow
        />
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
    justifyContent: "center",
    backgroundColor: Colors.primaryLightBackground,
    paddingTop: Spacing.xxxHuge,
    paddingHorizontal: Spacing.large,
    paddingBottom: Spacing.xHuge,
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
  image: {
    resizeMode: "contain",
    width: "97%",
    height: 300,
    marginBottom: Spacing.xxxLarge,
  },
  headerText: {
    ...Typography.header1,
    marginBottom: Spacing.small,
  },
  bodyTextContainer: {
    marginBottom: Spacing.small,
  },
  bodyText: {
    ...Typography.header3,
    ...Typography.base,
    marginBottom: Spacing.medium,
    color: Colors.neutral100,
  },
  button: {
    width: "100%",
  },
  buttonInner: {
    width: "100%",
    paddingTop: Spacing.xSmall,
    paddingBottom: Spacing.xSmall + 1,
  },
})

export default AtRiskRecommendationScreen
