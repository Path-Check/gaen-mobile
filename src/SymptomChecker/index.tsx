import React, { FunctionComponent } from "react"
import {
  Image,
  View,
  StyleSheet,
  ScrollView,
  ImageSourcePropType,
} from "react-native"
import { useTranslation } from "react-i18next"

import { useStatusBarEffect } from "../navigation"
import { StatusBar, GlobalText } from "../components"

import { Outlines, Colors, Typography, Spacing, Iconography } from "../styles"
import { Images } from "../assets"

const SymptomCheckerScreen: FunctionComponent = () => {
  useStatusBarEffect("dark-content", Colors.primaryLightBackground)
  const { t } = useTranslation()

  return (
    <>
      <StatusBar backgroundColor={Colors.primaryLightBackground} />
      <ScrollView contentContainerStyle={style.contentContainer}>
        <GlobalText style={style.headerText}>
          {t("symptom_checker.my_health")}
        </GlobalText>
        <View style={style.checkInContainer}>
          <GlobalText style={style.checkInEyebrowText}>
            {t("symptom_checker.check-in")}
          </GlobalText>
          <GlobalText style={style.checkInHeaderText}>
            {t("symptom_checker.how_are_you_feeling")}
          </GlobalText>
          <View style={style.feelingButtonsContainer}>
            <FeelingButton
              image={Images.HugEmoji}
              text={t("symptom_checker.good")}
            />
            <View style={style.feelingButtonsInnerSpacer} />
            <FeelingButton
              image={Images.HugEmoji}
              text={t("symptom_checker.not_well")}
            />
          </View>
        </View>
      </ScrollView>
    </>
  )
}

const style = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
    backgroundColor: Colors.primaryLightBackground,
    paddingTop: Spacing.xxxHuge,
    paddingHorizontal: Spacing.large,
  },
  headerText: {
    ...Typography.header1,
    ...Typography.bold,
    marginBottom: Spacing.xLarge,
  },
  checkInContainer: {
    ...Outlines.baseShadow,
    backgroundColor: Colors.primaryLightBackground,
    borderRadius: Outlines.borderRadiusLarge,
    paddingVertical: Spacing.medium,
    paddingHorizontal: Spacing.large,
  },
  checkInEyebrowText: {
    ...Typography.body1,
  },
  checkInHeaderText: {
    ...Typography.header3,
    marginBottom: Spacing.medium,
  },
  feelingButtonsContainer: {
    flexDirection: "row",
  },
  feelingButtonsInnerSpacer: {
    width: Spacing.xSmall,
  },
})

interface FeelingButtonProps {
  image: ImageSourcePropType
  text: string
}

const FeelingButton: FunctionComponent<FeelingButtonProps> = ({
  image,
  text,
}) => {
  return (
    <View style={feelingButtonStyle.container}>
      <Image
        source={image}
        accessibilityLabel={text}
        accessible
        style={feelingButtonStyle.image}
      />
      <GlobalText style={feelingButtonStyle.text}>{text}</GlobalText>
    </View>
  )
}

const feelingButtonHeight = 120
const feelingButtonStyle = StyleSheet.create({
  container: {
    flex: 1,
    height: feelingButtonHeight,
    borderColor: Colors.neutral10,
    borderWidth: Outlines.hairline,
    borderRadius: Outlines.borderRadiusLarge,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    ...Typography.body1,
    fontSize: Typography.large,
  },
  image: {
    resizeMode: "contain",
    width: Iconography.small,
    height: Iconography.small,
    marginBottom: Spacing.xxSmall,
  },
})

export default SymptomCheckerScreen
