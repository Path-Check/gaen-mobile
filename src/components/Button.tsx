import React, { FunctionComponent } from "react"
import {
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from "react-native"
import LinearGradient from "react-native-linear-gradient"
import { SvgXml } from "react-native-svg"

import { GlobalText } from "./GlobalText"
import { Icons } from "../assets"

import { Spacing, Colors, Buttons, Typography } from "../styles"

interface ButtonProps {
  label: string
  onPress: () => void
  loading?: boolean
  disabled?: boolean
  customButtonStyle?: ViewStyle
  customTextStyle?: TextStyle
  invert?: boolean
  testID?: string
  hasRightArrow?: boolean
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
  hasRightArrow,
}) => {
  const determineGradient = (): [string, string] => {
    if (invert && (disabled || loading)) {
      return [Colors.mediumGray, Colors.lighterGray]
    } else if (invert && !(disabled || loading)) {
      return [Colors.primaryBlue, Colors.white]
    } else if (!invert && (disabled || loading)) {
      return [Colors.darkestGray, Colors.mediumGray]
    } else {
      return [Colors.primaryBlue, Colors.secondaryViolet]
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
        start={{ x: 0, y: 0.85 }}
        end={{ x: 0.15, y: 0 }}
        colors={determineGradient()}
        style={buttonStyle}
      >
        {loading ? (
          <ActivityIndicator size={"large"} />
        ) : (
          <>
            <GlobalText style={textStyle}>{label}</GlobalText>
            {hasRightArrow && (
              <SvgXml
                xml={Icons.Arrow}
                fill={Colors.white}
                style={style.rightArrow}
              />
            )}
          </>
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
  rightArrow: {
    marginLeft: Spacing.medium,
  },
})
