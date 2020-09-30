import React, { FunctionComponent, useState } from "react"
import { View, StyleSheet, TouchableWithoutFeedback } from "react-native"
import { SvgXml } from "react-native-svg"

import { GlobalText } from "../components"

import { Typography, Colors, Iconography, Outlines, Spacing } from "../styles"
import { Icons } from "../assets"

interface SymptomCheckboxProps {
  label: string
  onPress: () => void
  checked: boolean
}

const SymptomCheckbox: FunctionComponent<SymptomCheckboxProps> = ({
  label,
  onPress,
  checked,
}) => {
  const [pressing, setPressing] = useState<boolean>(false)

  const checkboxIcon = checked ? Icons.CheckboxChecked : Icons.CheckboxUnchecked
  const checkboxColor = checked ? Colors.primary100 : Colors.neutral75

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
      accessible
      accessibilityLabel={label}
    >
      <View style={{ ...style.checkboxContainer, ...pressingStyle }}>
        <SvgXml
          xml={checkboxIcon}
          fill={checkboxColor}
          width={Iconography.small}
          height={Iconography.small}
        />
        <GlobalText style={style.checkboxText}>{label}</GlobalText>
      </View>
    </TouchableWithoutFeedback>
  )
}

const style = StyleSheet.create({
  checkboxContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.medium,
    paddingLeft: Spacing.medium,
    marginBottom: Spacing.medium,
    borderRadius: Outlines.baseBorderRadius,
    borderColor: Colors.secondary100,
    borderWidth: Outlines.hairline,
    backgroundColor: Colors.white,
  },
  checkboxText: {
    ...Typography.body1,
    ...Typography.largeFont,
    color: Colors.primaryText,
    width: "80%",
    marginLeft: Spacing.medium,
  },
  pressing: {
    opacity: 0.5,
  },
})

export default SymptomCheckbox
