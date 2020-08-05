import React, { FunctionComponent } from "react"
import {
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from "react-native"
import LinearGradient from "react-native-linear-gradient"

import { GlobalText } from "./GlobalText"

import { Colors, Buttons, Typography } from "../styles"

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
  const determineGradient = (): [string, string] => {
    if (invert && (disabled || loading)) {
      return [Colors.mediumGray, Colors.lighterGray]
    } else if (invert && !(disabled || loading)) {
      return [Colors.quaternaryViolet, Colors.white]
    } else if (!invert && (disabled || loading)) {
      return [Colors.primaryViolet, Colors.secondaryViolet]
    } else {
      return [Colors.primaryViolet, Colors.secondaryViolet]
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

  const buttonStyle = { ...style.button, ...customButtonStyle }
  const textStyle = { ...determineTextStyle(), ...customTextStyle }

  return (
    <TouchableOpacity
      onPress={onPress}
      accessible
      accessibilityLabel={label}
      accessibilityRole="button"
      disabled={disabled || loading}
      testID={testID}
    >
      <LinearGradient
        start={{ x: 0.15, y: 0.75 }}
        end={{ x: 0.95, y: 0.15 }}
        colors={determineGradient()}
        style={buttonStyle}
      >
        {loading ? (
          <ActivityIndicator size={"large"} />
        ) : (
          <GlobalText style={textStyle}>{label}</GlobalText>
        )}
      </LinearGradient>
    </TouchableOpacity>
  )
}

const style = StyleSheet.create({
  button: {
    ...Buttons.primary,
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
