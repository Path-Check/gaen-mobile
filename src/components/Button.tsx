import React from "react"
import {
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from "react-native"

import { RTLEnabledText } from "./RTLEnabledText"

import { Buttons, Typography } from "../styles"

interface ButtonProps {
  label: string
  onPress: () => void
  loading?: boolean
  disabled?: boolean
  style?: ViewStyle
  textStyle?: TextStyle
  invert?: boolean
}

export const Button = ({
  label,
  onPress,
  disabled,
  loading,
  style,
  textStyle,
  invert,
}: ButtonProps): JSX.Element => {
  const styles = invert ? darkStyle : lightStyle
  const buttonTextStyle =
    disabled || loading
      ? { ...styles.text, ...styles.textDisabled, ...textStyle }
      : { ...styles.text, ...styles.textEnabled, ...textStyle }

  return (
    <TouchableOpacity
      onPress={onPress}
      accessible
      accessibilityLabel={label}
      accessibilityRole="button"
      disabled={disabled || loading}
      style={[styles.button, style]}
    >
      {loading ? (
        <ActivityIndicator size={"large"} />
      ) : (
        <RTLEnabledText style={buttonTextStyle}>{label}</RTLEnabledText>
      )}
    </TouchableOpacity>
  )
}

/* eslint-disable react-native/no-unused-styles */
const lightStyle = StyleSheet.create({
  button: {
    ...Buttons.largeWhite,
  },
  text: {
    textAlign: "center",
  },
  textEnabled: {
    ...Typography.buttonTextDark,
  },
  textDisabled: {
    ...Typography.buttonTextDark,
    opacity: 0.5,
  },
})

const darkStyle = StyleSheet.create({
  button: {
    ...Buttons.largeBlue,
  },
  text: {
    textAlign: "center",
  },
  textEnabled: {
    ...Typography.buttonTextLight,
  },
  textDisabled: {
    ...Typography.buttonTextLight,
    opacity: 0.5,
  },
})

