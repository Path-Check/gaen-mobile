import React, { FunctionComponent } from "react"
import { useNavigation } from "@react-navigation/native"
import { useTranslation } from "react-i18next"
import { TouchableOpacity, View } from "react-native"
import { SvgXml } from "react-native-svg"

import { Icons } from "../assets"
import { Button, GlobalText } from "../components"
import { Colors, Iconography } from "../styles"
import { SelfScreenerStackScreens } from "../navigation"

import { useSelfScreenerContext } from "../SelfScreenerContext"
import { AgeRange } from "./selfScreener"

const AgeRangeQuestion: FunctionComponent = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const { EIGHTEEN_TO_SIXTY_FOUR, SIXTY_FIVE_AND_OVER } = AgeRange
  const { ageRange, updateAgeRange } = useSelfScreenerContext()

  const ageRangeToString = (range: AgeRange) => {
    switch (range) {
      case EIGHTEEN_TO_SIXTY_FOUR:
        return t("self_screener.age_range.eighteen_to_sixty_four")
      case SIXTY_FIVE_AND_OVER:
        return t("self_screener.age_range.sixty_five_and_over")
    }
  }

  const handleOnPressNext = () => {
    navigation.navigate(SelfScreenerStackScreens.Summary)
  }

  return (
    <View>
      <GlobalText>{t("self_screener.age_range.how_old_are_you")}</GlobalText>
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
      <Button label={t("common.next")} onPress={handleOnPressNext} />
    </View>
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
  const checkboxIcon = isSelected
    ? Icons.CheckboxChecked
    : Icons.CheckboxUnchecked
  return (
    <TouchableOpacity onPress={onPress} accessible accessibilityLabel={label}>
      <SvgXml
        xml={checkboxIcon}
        fill={Colors.primary125}
        width={Iconography.small}
        height={Iconography.small}
      />
      <GlobalText>{label}</GlobalText>
    </TouchableOpacity>
  )
}

export default AgeRangeQuestion
