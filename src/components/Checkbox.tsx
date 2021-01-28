import React, { FunctionComponent, useState } from "react"
import { View, StyleSheet, TouchableWithoutFeedback } from "react-native"
import { SvgXml } from "react-native-svg"

import { Text } from "."

import { Colors, Iconography, Forms } from "../styles"
import { Icons } from "../assets"

interface CheckboxProps {
  label: string
  onPress: () => void
  checked: boolean
}

const Checkbox: FunctionComponent<CheckboxProps> = ({
  label,
  onPress,
  checked,
}) => {
  const [pressing, setPressing] = useState<boolean>(false)

  const checkboxIcon = checked ? Icons.CheckboxChecked : Icons.CheckboxUnchecked
  const checkboxColor = checked
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
        <Text style={style.checkboxText}>{label}</Text>
      </View>
    </TouchableWithoutFeedback>
  )
}

const style = StyleSheet.create({
  checkboxContainer: {
    ...Forms.radioOrCheckboxContainer,
  },
  checkboxText: {
    ...Forms.radioOrCheckboxText,
  },
  pressing: {
    opacity: 0.5,
  },
})

export default Checkbox
