import React, { FunctionComponent } from "react"
import {
  ActivityIndicator,
  StyleSheet,
  View,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from "react-native"
import { SvgXml } from "react-native-svg"

import Text from "./Text"
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
  const determineBackgroundColor = (): string => {
    if (outlined) {
      return Colors.transparent
    } else if (disabled || loading) {
      return Colors.secondary75
    } else {
      return Colors.primary100
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

  const backgroundColor = determineBackgroundColor()

  const buttonStyle = {
    ...style.button,
    backgroundColor,
    ...customButtonInnerStyle,
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      accessibilityLabel={label}
      accessibilityRole="button"
      disabled={disabled || loading}
      testID={testID}
      style={buttonContainerStyle}
    >
      <View style={buttonStyle}>
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
            <Text style={textStyle}>{label}</Text>
            {hasRightArrow && (
              <SvgXml
                xml={Icons.Arrow}
                fill={determineRightArrowColor()}
                style={style.rightArrow}
              />
            )}
          </>
        )}
      </View>
    </TouchableOpacity>
  )
}

const style = StyleSheet.create({
  buttonContainer: {
    alignSelf: "center",
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
