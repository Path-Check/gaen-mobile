import React, { FunctionComponent } from "react"
import {
  TouchableOpacity,
  View,
  Image,
  StyleSheet,
  ImageSourcePropType,
} from "react-native"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"

import { GlobalText } from "../components"
import { ModalStackScreens, Stacks } from "../navigation"

import { Outlines, Colors, Typography, Spacing, Iconography } from "../styles"
import { Images } from "../assets"

const HowAreYouFeeling: FunctionComponent = () => {
  const navigation = useNavigation()

  const handleOnPressGood = async () => {}

  const handleOnPressNotWell = async () => {
    navigation.navigate(Stacks.Modal, {
      screen: ModalStackScreens.SelfScreenerFromMyHealth,
    })
  }

  return (
    <SelectFeeling
      handleOnPressGood={handleOnPressGood}
      handleOnPressNotWell={handleOnPressNotWell}
    />
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
    <View style={style.floatingContainer}>
      <GlobalText style={style.checkInHeaderText}>
        {t("symptom_checker.how_are_you_feeling")}
      </GlobalText>
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
    </View>
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
  checkInHeaderText: {
    ...Typography.header3,
    paddingRight: Spacing.xxLarge,
    marginBottom: Spacing.xSmall,
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
  floatingContainer: {
    ...Outlines.lightShadow,
    backgroundColor: Colors.primaryLightBackground,
    borderRadius: Outlines.borderRadiusLarge,
    paddingVertical: Spacing.medium,
    paddingHorizontal: Spacing.large,
    marginBottom: Spacing.large,
  },
})

export default HowAreYouFeeling
