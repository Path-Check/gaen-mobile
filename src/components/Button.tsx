import React, { FunctionComponent } from "react"
import {
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from "react-native"

import { GlobalText } from "./GlobalText"

import { Buttons, Typography } from "../styles"

interface ButtonProps {
  label: string
  onPress: () => void
  loading?: boolean
  disabled?: boolean
  buttonStyle?: ViewStyle
  textStyle?: TextStyle
  invert?: boolean
  testID?: string
}

export const Button: FunctionComponent<ButtonProps> = ({
  label,
  onPress,
  disabled,
  loading,
  buttonStyle,
  textStyle,
  invert,
  testID,
}) => {
  const buttonColorStyle = invert ? Buttons.primaryInverted : Buttons.primary
  const buttonStyles =
    disabled || loading
      ? { ...buttonColorStyle, ...style.buttonDisabled, ...buttonStyle }
      : { ...buttonColorStyle, ...style.buttonEnabled, ...buttonStyle }
  const buttonTextStyle =
    disabled || loading
      ? { ...style.text, ...style.textDisabled, ...textStyle }
      : { ...style.text, ...style.textEnabled, ...textStyle }

  return (
    <TouchableOpacity
      onPress={onPress}
      accessible
      accessibilityLabel={label}
      accessibilityRole="button"
      disabled={disabled || loading}
      style={buttonStyles}
      testID={testID}
    >
      {loading ? (
        <ActivityIndicator size={"large"} />
      ) : (
        <GlobalText style={buttonTextStyle}>{label}</GlobalText>
      )}
    </TouchableOpacity>
  )
}

const style = StyleSheet.create({
  buttonDisabled: {
    ...Buttons.primaryInvertedDisabled,
  },
  buttonEnabled: {
    ...Buttons.primaryInverted,
  },
  text: {
    textAlign: "center",
  },
  textEnabled: {
    ...Typography.buttonPrimaryInvertedText,
  },
  textDisabled: {
    ...Typography.buttonPrimaryInvertedDisabledText,
  },
})
