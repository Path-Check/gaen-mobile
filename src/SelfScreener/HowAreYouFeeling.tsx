import React, { FunctionComponent } from "react"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native"

import { SelfScreenerStackScreens } from "../navigation"
import { Typography, Spacing, Iconography, Colors, Outlines } from "../styles"
import { GlobalText } from "../components"
import { Images } from "../assets"

const HowAreYouFeeling: FunctionComponent = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()

  const handlePressGood = () => {
    navigation.navigate(SelfScreenerStackScreens.AsymptomaticFlowIntro)
  }
  const handlePressNotWell = () => {
    navigation.navigate(SelfScreenerStackScreens.EmergencySymptomsQuestions)
  }

  return (
    <View style={style.contentContainer}>
      <GlobalText style={style.headerText}>
        {t("self_screener.how_are_you_feeling.title")}
      </GlobalText>
      <SelectFeeling
        handleOnPressGood={handlePressGood}
        handleOnPressNotWell={handlePressNotWell}
      />
    </View>
  )
}

interface SelectFeelingProps {
  handleOnPressGood: () => void
  handleOnPressNotWell: () => void
}

const SelectFeeling: FunctionComponent<SelectFeelingProps> = ({
  handleOnPressGood,
  handleOnPressNotWell,
}) => {
  const { t } = useTranslation()
  return (
    <>
      <View style={style.feelingButtonsContainer}>
        <FeelingButton
          image={Images.SmileEmoji}
          text={t("symptom_checker.good")}
          onPress={handleOnPressGood}
        />
        <View style={style.feelingButtonsInnerSpacer} />
        <FeelingButton
          image={Images.SickEmoji}
          text={t("symptom_checker.not_well")}
          onPress={handleOnPressNotWell}
        />
      </View>
    </>
  )
}

interface FeelingButtonProps {
  image: ImageSourcePropType
  text: string
  onPress: () => void
}

const FeelingButton: FunctionComponent<FeelingButtonProps> = ({
  image,
  text,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={style.feelingButtonContainer}>
      <Image
        source={image}
        accessibilityLabel={text}
        accessible
        style={style.feelingButtonImage}
      />
      <GlobalText style={style.feelingButtonText}>{text}</GlobalText>
    </TouchableOpacity>
  )
}

const feelingButtonHeight = 120

const style = StyleSheet.create({
  headerText: {
    ...Typography.header1,
    marginBottom: Spacing.medium,
  },
  contentContainer: {
    backgroundColor: Colors.primaryLightBackground,
    paddingVertical: Spacing.large,
    paddingHorizontal: Spacing.xLarge,
    flexGrow: 1,
  },
  feelingButtonsContainer: {
    flexDirection: "row",
    marginTop: Spacing.medium,
  },
  feelingButtonsInnerSpacer: {
    width: Spacing.xSmall,
  },
  feelingButtonContainer: {
    flex: 1,
    height: feelingButtonHeight,
    borderColor: Colors.neutral10,
    borderWidth: Outlines.hairline,
    borderRadius: Outlines.borderRadiusLarge,
    justifyContent: "center",
    alignItems: "center",
  },
  feelingButtonText: {
    ...Typography.body1,
    fontSize: Typography.large,
  },
  feelingButtonImage: {
    resizeMode: "contain",
    width: Iconography.small,
    height: Iconography.small,
    marginBottom: Spacing.xxSmall,
  },
})

export default HowAreYouFeeling
