import React, { FunctionComponent, useState } from "react"
import {
  StyleSheet,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useTranslation } from "react-i18next"
import { SvgXml } from "react-native-svg"

import { Text } from "../components"
import { Colors, Forms, Iconography } from "../styles"
import { SelfAssessmentStackScreens } from "../navigation"
import { useSelfAssessmentContext } from "../SelfAssessmentContext"
import { AgeRange } from "./selfAssessment"
import SelfAssessmentLayout from "./SelfAssessmentLayout"

import { Typography, Spacing, Buttons } from "../styles"
import { Icons } from "../assets"

const AgeRangeQuestion: FunctionComponent = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const { EIGHTEEN_TO_SIXTY_FOUR, SIXTY_FIVE_AND_OVER } = AgeRange
  const { ageRange, updateAgeRange } = useSelfAssessmentContext()

  const ageRangeToString = (range: AgeRange) => {
    switch (range) {
      case EIGHTEEN_TO_SIXTY_FOUR:
        return t("self_assessment.age_range.eighteen_to_sixty_four")
      case SIXTY_FIVE_AND_OVER:
        return t("self_assessment.age_range.sixty_five_and_over")
    }
  }

  const handleOnPressNext = () => {
    navigation.navigate(SelfAssessmentStackScreens.Guidance)
  }

  const buttonDisabled = ageRange === null

  return (
    <SelfAssessmentLayout
      bottomActionsContent={
        <TouchableOpacity
          style={buttonDisabled ? style.buttonDisabled : style.button}
          onPress={handleOnPressNext}
          accessibilityLabel={t("self_assessment.age_range.get_my_guidance")}
          disabled={buttonDisabled}
        >
          <Text
            style={buttonDisabled ? style.buttonDisabledText : style.buttonText}
          >
            {t("self_assessment.age_range.get_my_guidance")}
          </Text>
          <SvgXml
            xml={Icons.Arrow}
            fill={
              buttonDisabled
                ? Colors.text.primary
                : Colors.background.primaryLight
            }
          />
        </TouchableOpacity>
      }
    >
      <Text style={style.headerText}>
        {t("self_assessment.age_range.how_old_are_you")}
      </Text>
      <RadioButton
        onPress={() => updateAgeRange(EIGHTEEN_TO_SIXTY_FOUR)}
        isSelected={ageRange === EIGHTEEN_TO_SIXTY_FOUR}
        label={ageRangeToString(EIGHTEEN_TO_SIXTY_FOUR)}
      />
      <RadioButton
        onPress={() => updateAgeRange(SIXTY_FIVE_AND_OVER)}
        isSelected={ageRange === SIXTY_FIVE_AND_OVER}
        label={ageRangeToString(SIXTY_FIVE_AND_OVER)}
      />
    </SelfAssessmentLayout>
  )
}

type RadioButtonProps = {
  onPress: () => void
  isSelected: boolean
  label: string
}
const RadioButton: FunctionComponent<RadioButtonProps> = ({
  onPress,
  isSelected,
  label,
}) => {
  const [pressing, setPressing] = useState<boolean>(false)

  const radioIcon = isSelected ? Icons.RadioSelected : Icons.RadioUnselected
  const radioColor = isSelected
    ? Colors.primary.shade100
    : Colors.neutral.shade75

  const handleOnPressIn = () => {
    setPressing(true)
  }
  const handleOnPressOut = () => {
    setPressing(false)
  }
  const pressingStyle = pressing ? style.pressing : {}

  return (
    <TouchableWithoutFeedback
      onPress={onPress}
      onPressIn={handleOnPressIn}
      onPressOut={handleOnPressOut}
      accessibilityLabel={label}
    >
      <View style={{ ...style.radioContainer, ...pressingStyle }}>
        <SvgXml
          xml={radioIcon}
          fill={radioColor}
          width={Iconography.small}
          height={Iconography.small}
        />
        <Text style={style.radioText}>{label}</Text>
      </View>
    </TouchableWithoutFeedback>
  )
}

const style = StyleSheet.create({
  headerText: {
    ...Typography.header1,
    marginBottom: Spacing.medium,
  },
  radioContainer: {
    ...Forms.radioOrCheckboxContainer,
  },
  radioText: {
    ...Forms.radioOrCheckboxText,
  },
  button: {
    ...Buttons.primaryThin,
    alignSelf: "center",
    width: "100%",
  },
  buttonDisabled: {
    ...Buttons.primaryThinDisabled,
    alignSelf: "center",
    width: "100%",
  },
  buttonText: {
    ...Typography.buttonPrimary,
    marginRight: Spacing.small,
  },
  buttonDisabledText: {
    ...Typography.buttonPrimaryDisabled,
    marginRight: Spacing.small,
  },
  pressing: {
    opacity: 0.5,
  },
})

export default AgeRangeQuestion
