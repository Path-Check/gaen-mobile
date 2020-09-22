import React, { FunctionComponent, useState, useEffect } from "react"
import {
  TouchableOpacity,
  View,
  Image,
  StyleSheet,
  ImageSourcePropType,
  Linking,
} from "react-native"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"
import { SvgXml } from "react-native-svg"

import { GlobalText, Button } from "../components"
import { useMyHealthContext } from "./MyHealthContext"
import { HealthAssessment } from "./symptoms"
import { MyHealthStackScreens } from "../navigation"

import { Outlines, Colors, Typography, Spacing, Iconography } from "../styles"
import { Icons, Images } from "../assets"
import { useConfigurationContext } from "../ConfigurationContext"

enum CheckInStatus {
  NotCheckedIn,
  FeelingGood,
  FeelingNotWell,
}

const Today: FunctionComponent = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const { symptoms, healthAssessment } = useMyHealthContext()

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
    navigation.navigate(MyHealthStackScreens.SelectSymptoms)
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
            healthAssessment={healthAssessment}
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
  healthAssessment: HealthAssessment
}

const FeelingNotWellContent: FunctionComponent<FeelingNotWellContentProps> = ({
  symptoms,
  healthAssessment,
}) => {
  const { t } = useTranslation()
  const { findATestCenterUrl } = useConfigurationContext()

  const handleOnPressFindTestCenter = () => {
    if (findATestCenterUrl) {
      Linking.openURL(findATestCenterUrl)
    }
  }

  const determineHealthAssessmentText = () => {
    switch (healthAssessment) {
      case HealthAssessment.AtRisk:
        return (
          <View style={style.healthAssessmentContainer}>
            <GlobalText style={style.healthAssessmentText}>
              {t("symptom_checker.sorry_not_feeling_well")}
            </GlobalText>
            <GlobalText style={style.healthAssessmentText}>
              {t("symptom_checker.get_tested")}
            </GlobalText>
          </View>
        )
      case HealthAssessment.NotAtRisk:
        return t("symptom_checker.follow_ha_guidance")
    }
  }

  return (
    <>
      <GlobalText style={style.checkInHeaderText}>
        {t("symptom_checker.sorry_to_hear_it")}
      </GlobalText>
      {determineHealthAssessmentText()}
      {findATestCenterUrl && (
        <Button
          label={t("symptom_checker.find_a_test_center")}
          onPress={handleOnPressFindTestCenter}
          customButtonStyle={style.button}
          customButtonInnerStyle={style.buttonInner}
          hasRightArrow
        />
      )}
      <GlobalText style={style.sectionLabel}>
        {t("symptom_checker.symptoms")}
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
  checkInContainer: {
    ...Outlines.lightShadow,
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
    marginBottom: Spacing.xxxSmall,
  },
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
  healthAssessmentContainer: {
    marginBottom: Spacing.xSmall,
  },
  healthAssessmentText: {
    ...Typography.header5,
    ...Typography.base,
    marginBottom: Spacing.xSmall,
  },
  button: {
    width: "100%",
    elevation: 0,
    shadowOpacity: 0,
  },
  buttonInner: {
    width: "100%",
    paddingTop: Spacing.xSmall,
    paddingBottom: Spacing.xSmall + 1,
    marginBottom: Spacing.medium,
  },
  sectionLabel: {
    ...Typography.body2,
    marginBottom: Spacing.xSmall,
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

export default Today
