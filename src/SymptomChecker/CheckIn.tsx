import React, { FunctionComponent, useState, useEffect } from "react"
import {
  TouchableOpacity,
  View,
  Image,
  StyleSheet,
  ImageSourcePropType,
} from "react-native"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"
import { SvgXml } from "react-native-svg"

import { GlobalText } from "../components"
import { useSymptomCheckerContext } from "./SymptomCheckerContext"
import { HealthRecommendation, determineHealthRecommendation } from "./symptoms"
import { SymptomCheckerStackScreens } from "../navigation"

import { Outlines, Colors, Typography, Spacing, Iconography } from "../styles"
import { Icons, Images } from "../assets"

enum CheckInStatus {
  NotCheckedIn,
  FeelingGood,
  FeelingNotWell,
}

const CheckIn: FunctionComponent = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const { symptoms, healthRecommendation } = useSymptomCheckerContext()

  const [checkInStatus, setCheckInStatus] = useState<CheckInStatus>(
    CheckInStatus.NotCheckedIn,
  )

  useEffect(() => {
    if (symptoms.length > 0) {
      setCheckInStatus(CheckInStatus.FeelingNotWell)
    }
  }, [symptoms])

  const handleOnPressGood = () => {
    setCheckInStatus(CheckInStatus.FeelingGood)
  }

  const handleOnPressNotWell = () => {
    navigation.navigate(SymptomCheckerStackScreens.SelectSymptoms)
  }

  const determineStatusContent = () => {
    switch (checkInStatus) {
      case CheckInStatus.NotCheckedIn:
        return (
          <SelectFeeling
            handleOnPressGood={handleOnPressGood}
            handleOnPressNotWell={handleOnPressNotWell}
          />
        )
      case CheckInStatus.FeelingGood:
        return <FeelingGoodContent />
      case CheckInStatus.FeelingNotWell:
        return (
          <FeelingNotWellContent
            symptoms={symptoms}
            healthRecommendation={healthRecommendation}
          />
        )
    }
  }

  const iconFill =
    checkInStatus === CheckInStatus.NotCheckedIn
      ? Colors.secondary50
      : Colors.primary100

  return (
    <>
      <GlobalText style={style.headerText}>
        {t("symptom_checker.my_health")}
      </GlobalText>
      <View style={style.checkInContainer}>
        <SvgXml
          xml={Icons.CheckInBrokenCircle}
          fill={iconFill}
          width={Iconography.xSmall}
          height={Iconography.xSmall}
          style={style.checkmarkIcon}
        />
        <GlobalText style={style.checkInEyebrowText}>
          {t("symptom_checker.check-in")}
        </GlobalText>
        {determineStatusContent()}
      </View>
    </>
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
    </>
  )
}

const FeelingGoodContent: FunctionComponent = () => {
  const { t } = useTranslation()

  return (
    <GlobalText style={style.checkInHeaderText}>
      {t("symptom_checker.glad_to_hear_it")}
    </GlobalText>
  )
}

interface FeelingNotWellContentProps {
  symptoms: string[]
  healthRecommendation: HealthRecommendation
}

const FeelingNotWellContent: FunctionComponent<FeelingNotWellContentProps> = ({
  symptoms,
  healthRecommendation,
}) => {
  const { t } = useTranslation()

  const determineHealthRecommendationText = () => {
    switch (healthRecommendation) {
      case HealthRecommendation.GetTested:
        return t("symptom_checker.get_tested")
      case HealthRecommendation.FollowHAGuidance:
        return t("symptom_checker.follow_ha_guidance")
    }
  }

  return (
    <>
      <GlobalText style={style.checkInHeaderText}>
        {t("symptom_checker.sorry_to_hear_it")}
      </GlobalText>
      <GlobalText style={style.healthRecommendationText}>
        {determineHealthRecommendationText()}
      </GlobalText>
      <View style={style.symptomsContainer}>
        {symptoms.map((value) => {
          return (
            <View style={style.symptomContainer} key={value}>
              <GlobalText style={style.symptomText}>{value}</GlobalText>
            </View>
          )
        })}
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
  checkmarkIcon: {
    position: "absolute",
    top: Spacing.medium,
    right: Spacing.medium,
  },
  checkInEyebrowText: {
    ...Typography.body1,
  },
  checkInHeaderText: {
    ...Typography.header3,
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
  healthRecommendationText: {
    ...Typography.header5,
    marginTop: Spacing.medium,
    marginBottom: Spacing.large,
  },
  symptomsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  symptomContainer: {
    backgroundColor: Colors.neutral10,
    borderRadius: Outlines.borderRadiusLarge,
    paddingVertical: Spacing.xxxSmall,
    paddingHorizontal: Spacing.small,
    marginRight: Spacing.xxSmall,
    marginBottom: Spacing.xxSmall,
  },
  symptomText: {
    ...Typography.body2,
    color: Colors.primaryText,
  },
})

export default CheckIn
