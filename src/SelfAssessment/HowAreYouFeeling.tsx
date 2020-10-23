import React, { FunctionComponent } from "react"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"
import {
  Image,
  ImageSourcePropType,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native"

import { Text } from "../components"
import { SelfAssessmentStackScreens } from "../navigation"
import { useSelfAssessmentContext } from "../SelfAssessmentContext"

import { Typography, Spacing, Iconography, Colors, Outlines } from "../styles"
import { Images } from "../assets"

const HowAreYouFeeling: FunctionComponent = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const selfAssessmentContext = useSelfAssessmentContext()

  const handleOnPressGood = () => {
    selfAssessmentContext.clearSymptoms()
    navigation.navigate(SelfAssessmentStackScreens.Guidance)
  }
  const handleOnPressNotWell = () => {
    navigation.navigate(SelfAssessmentStackScreens.EmergencySymptomsQuestions)
  }

  return (
    <ScrollView
      contentContainerStyle={style.contentContainer}
      alwaysBounceVertical={false}
    >
      <Text style={style.headerText}>
        {t("self_assessment.how_are_you_feeling.title")}
      </Text>
      <View style={style.feelingButtonsContainer}>
        <FeelingButton
          image={Images.SmileEmoji}
          text={t("self_assessment.how_are_you_feeling.good")}
          onPress={handleOnPressGood}
        />
        <View style={style.feelingButtonsInnerSpacer} />
        <FeelingButton
          image={Images.SickEmoji}
          text={t("self_assessment.how_are_you_feeling.not_well")}
          onPress={handleOnPressNotWell}
        />
      </View>
    </ScrollView>
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
      <Text style={style.feelingButtonText}>{text}</Text>
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
    backgroundColor: Colors.background.primaryLight,
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
    borderColor: Colors.neutral.shade10,
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
