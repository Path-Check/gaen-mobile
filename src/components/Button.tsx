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

import GlobalText from "./GlobalText"
import { Icons } from "../assets"

import { Outlines, Spacing, Colors, Buttons, Typography } from "../styles"

interface ButtonProps {
  label: string
  onPress: () => void
  loading?: boolean
  disabled?: boolean
  customButtonStyle?: ViewStyle
  customButtonInnerStyle?: ViewStyle
  customTextStyle?: TextStyle
  testID?: string
  hasRightArrow?: boolean
  hasPlusIcon?: boolean
  outlined?: boolean
}

const Button: FunctionComponent<ButtonProps> = ({
  label,
  onPress,
  disabled,
  loading,
  customButtonStyle,
  customButtonInnerStyle,
  customTextStyle,
  testID,
  hasRightArrow,
  hasPlusIcon,
  outlined,
}) => {
  const determineGradient = (): string[] => {
    if (outlined) {
      return [Colors.transparent, Colors.transparent]
    } else if (disabled || loading) {
      return [Colors.secondary75, Colors.secondary75]
    } else {
      return Colors.gradient100
    }
  }

  const determineRightArrowColor = (): string => {
    if (disabled) {
      return Colors.black
    } else if (outlined) {
      return Colors.primary110
    } else {
      return Colors.white
    }
  }

  const determineTextStyle = (): TextStyle => {
    if (outlined) {
      return style.outlinedButtonText
    } else if (disabled || loading) {
      return style.textDisabled
    } else {
      return style.text
    }
  }
  const textStyle = { ...determineTextStyle(), ...customTextStyle }

  const determineShadowEnabled = (): ViewStyle => {
    if (disabled || loading || outlined) {
      return {}
    } else {
      return style.buttonContainerShadow
    }
  }
  const determineBorder = (): ViewStyle => {
    if (outlined) {
      return style.buttonBorder
    } else {
      return {}
    }
  }
  const buttonContainerStyle = {
    ...style.buttonContainer,
    ...determineShadowEnabled(),
    ...determineBorder(),
    ...customButtonStyle,
  }

  const buttonStyle = {
    ...style.button,
    ...customButtonInnerStyle,
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      accessible
      accessibilityLabel={label}
      accessibilityRole="button"
      disabled={disabled || loading}
      testID={testID}
      style={buttonContainerStyle}
    >
      <LinearGradient
        colors={determineGradient()}
        style={buttonStyle}
        useAngle
        angle={213.69}
        angleCenter={{ x: 0.5, y: 0.5 }}
      >
        {loading ? (
          <ActivityIndicator size={"small"} />
        ) : (
          <>
            {hasPlusIcon && (
              <SvgXml
                xml={Icons.Plus}
                fill={disabled ? Colors.black : Colors.white}
                style={style.leftPlus}
              />
            )}
            <GlobalText style={textStyle}>{label}</GlobalText>
            {hasRightArrow && (
              <SvgXml
                xml={Icons.Arrow}
                fill={determineRightArrowColor()}
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
  buttonContainer: {
    alignSelf: "center",
    borderRadius: Outlines.borderRadiusMax,
  },
  buttonContainerShadow: {
    ...Outlines.baseShadow,
  },
  button: {
    ...Buttons.primary,
  },
  text: {
    textAlign: "center",
    ...Typography.buttonPrimary,
  },
  textDisabled: {
    textAlign: "center",
    ...Typography.buttonPrimaryDisabled,
  },
  outlinedButtonText: {
    ...Typography.buttonPrimary,
    color: Colors.primary110,
  },
  buttonBorder: {
    borderWidth: Outlines.thin,
    borderColor: Colors.primary110,
  },
  rightArrow: {
    marginLeft: Spacing.medium,
  },
  leftPlus: {
    marginRight: Spacing.xSmall,
  },
})

export default Button
