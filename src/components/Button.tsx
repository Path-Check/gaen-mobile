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
  customButtonStyle?: ViewStyle
  customTextStyle?: TextStyle
  invert?: boolean
  testID?: string
}

export const Button: FunctionComponent<ButtonProps> = ({
  label,
  onPress,
  disabled,
  loading,
  customButtonStyle,
  customTextStyle,
  invert,
  testID,
}) => {
  const determineButtonStyle = (): ViewStyle => {
    if (invert && (disabled || loading)) {
      return style.buttonInvertedDisabled
    } else if (invert && !(disabled || loading)) {
      return style.buttonInverted
    } else if (!invert && (disabled || loading)) {
      return style.buttonDisabled
    } else {
      return style.button
    }
  }

  const determineTextStyle = (): TextStyle => {
    if (invert && (disabled || loading)) {
      return style.textInvertedDisabled
    } else if (invert && !(disabled || loading)) {
      return style.textInverted
    } else if (!invert && (disabled || loading)) {
      return style.textDisabled
    } else {
      return style.text
    }
  }

  const buttonStyle = { ...determineButtonStyle(), ...customButtonStyle }
  const textStyle = { ...determineTextStyle(), ...customTextStyle }

  return (
    <TouchableOpacity
      onPress={onPress}
      accessible
      accessibilityLabel={label}
      accessibilityRole="button"
      disabled={disabled || loading}
      style={buttonStyle}
      testID={testID}
    >
      {loading ? (
        <ActivityIndicator size={"large"} />
      ) : (
        <GlobalText style={textStyle}>{label}</GlobalText>
      )}
    </TouchableOpacity>
  )
}

const style = StyleSheet.create({
  button: {
    ...Buttons.primary,
  },
  buttonInverted: {
    ...Buttons.primaryInverted,
  },
  buttonDisabled: {
    ...Buttons.primaryDisabled,
  },
  buttonInvertedDisabled: {
    ...Buttons.primaryInvertedDisabled,
  },
  text: {
    textAlign: "center",
    ...Typography.buttonPrimaryText,
  },
  textInverted: {
    textAlign: "center",
    ...Typography.buttonPrimaryInvertedText,
  },
  textDisabled: {
    textAlign: "center",
    ...Typography.buttonPrimaryDisabledText,
  },
  textInvertedDisabled: {
    textAlign: "center",
    ...Typography.buttonPrimaryInvertedDisabledText,
  },
})
