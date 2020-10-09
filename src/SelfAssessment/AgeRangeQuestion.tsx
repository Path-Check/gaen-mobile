import React, { FunctionComponent, useState } from "react"
import { StyleSheet, View, TouchableWithoutFeedback } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useTranslation } from "react-i18next"
import { SvgXml } from "react-native-svg"

import { Icons } from "../assets"
import { Button, Text } from "../components"
import { Colors, Forms, Iconography } from "../styles"
import { SelfAssessmentStackScreens } from "../navigation"
import { useSelfAssessmentContext } from "../SelfAssessmentContext"
import { AgeRange } from "./selfAssessment"
import SelfAssessmentLayout from "./SelfAssessmentLayout"

import { Typography, Spacing, Buttons } from "../styles"

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

  return (
    <SelfAssessmentLayout
      bottomActionsContent={
        <Button
          label={t("self_assessment.age_range.get_my_guidance")}
          onPress={handleOnPressNext}
          hasRightArrow
          customButtonStyle={style.button}
          customButtonInnerStyle={style.buttonInner}
        />
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
  const radioColor = isSelected ? Colors.primary100 : Colors.neutral75

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
    width: "100%",
  },
  buttonInner: {
    ...Buttons.medium,
    width: "100%",
  },
  pressing: {
    opacity: 0.5,
  },
})

export default AgeRangeQuestion
