import React, { FunctionComponent } from "react"
import {
  TouchableOpacity,
  ScrollView,
  View,
  Image,
  StyleSheet,
  ImageSourcePropType,
  Linking,
} from "react-native"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"
import { SvgXml } from "react-native-svg"
import { showMessage } from "react-native-flash-message"

import { GlobalText, Button } from "../components"
import { CheckInStatus } from "./symptoms"
import { MyHealthStackScreens } from "../navigation"

import {
  Outlines,
  Colors,
  Typography,
  Spacing,
  Iconography,
  Affordances,
} from "../styles"
import { Icons, Images } from "../assets"
import { useConfigurationContext } from "../ConfigurationContext"
import { useSymptomLogContext } from "./SymptomLogContext"

const Today: FunctionComponent = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const {
    todaysCheckIn: { status: checkInStatus },
    addTodaysCheckIn,
  } = useSymptomLogContext()

  const handleOnPressGood = async () => {
    const result = await addTodaysCheckIn(CheckInStatus.FeelingGood)
    if (result.kind === "failure") {
      showMessage({
        message: t("symptom_checker.errors.adding_check_in"),
        ...Affordances.errorFlashMessageOptions,
      })
    }
  }

  const handleOnPressNotWell = async () => {
    const result = await addTodaysCheckIn(CheckInStatus.FeelingNotWell)
    if (result.kind === "failure") {
      showMessage({
        message: t("symptom_checker.errors.adding_check_in"),
        ...Affordances.errorFlashMessageOptions,
      })
    } else {
      navigation.navigate(MyHealthStackScreens.SelectSymptoms)
    }
  }

  const handleOnPressLogSymptoms = () => {
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
        return <FeelingNotWellContent />
    }
  }

  const iconFill =
    checkInStatus === CheckInStatus.NotCheckedIn
      ? Colors.secondary50
      : Colors.primary100

  return (
    <ScrollView
      style={style.container}
      contentContainerStyle={style.contentContainer}
      alwaysBounceVertical={false}
    >
      <View style={style.floatingContainer}>
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
      <View style={style.floatingContainer}>
        <Button
          onPress={handleOnPressLogSymptoms}
          label={t("symptom_checker.log_symptoms")}
          customButtonStyle={{ ...style.button, ...style.logSymptomsButton }}
          customButtonInnerStyle={style.buttonInner}
          hasPlusIcon
        />
      </View>
    </ScrollView>
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
    <>
      <GlobalText style={style.checkInHeaderText}>
        {t("symptom_checker.glad_to_hear_it")}
      </GlobalText>
      <GlobalText style={style.healthAssessmentText}>
        {t("symptom_checker.check_in_again")}
      </GlobalText>
    </>
  )
}

const FeelingNotWellContent: FunctionComponent = () => {
  const { t } = useTranslation()
  const { findATestCenterUrl } = useConfigurationContext()

  const handleOnPressFindTestCenter = () => {
    if (findATestCenterUrl) {
      Linking.openURL(findATestCenterUrl)
    }
  }

  return (
    <>
      <GlobalText style={style.checkInHeaderText}>
        {t("symptom_checker.sorry_to_hear_it")}
      </GlobalText>
      <GlobalText style={style.healthAssessmentText}>
        {t("symptom_checker.get_tested")}
      </GlobalText>
      {findATestCenterUrl && (
        <Button
          label={t("symptom_checker.find_a_test_center")}
          onPress={handleOnPressFindTestCenter}
          customButtonStyle={style.button}
          customButtonInnerStyle={style.buttonInner}
          hasRightArrow
        />
      )}
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
  container: {
    flex: 1,
    backgroundColor: Colors.primaryLightBackground,
  },
  contentContainer: {
    paddingVertical: Spacing.large,
    paddingHorizontal: Spacing.xLarge,
  },
  floatingContainer: {
    ...Outlines.lightShadow,
    backgroundColor: Colors.primaryLightBackground,
    borderRadius: Outlines.borderRadiusLarge,
    paddingVertical: Spacing.medium,
    paddingHorizontal: Spacing.large,
    marginBottom: Spacing.large,
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
    marginBottom: Spacing.xxxSmall,
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
  healthAssessmentText: {
    ...Typography.header5,
    ...Typography.base,
  },
  button: {
    width: "100%",
    elevation: 0,
    shadowOpacity: 0,
    marginTop: Spacing.large,
  },
  logSymptomsButton: {
    marginTop: 0,
  },
  buttonInner: {
    width: "100%",
    paddingTop: Spacing.xSmall,
    paddingBottom: Spacing.xSmall + 1,
  },
})

export default Today
