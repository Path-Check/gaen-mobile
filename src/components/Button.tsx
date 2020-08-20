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

import { Outlines, Spacing, Colors, Buttons, Typography } from "../styles"
import { useTranslation } from "react-i18next"

interface ButtonProps {
  label: string
  onPress: () => void
  loading?: boolean
  disabled?: boolean
  customButtonStyle?: ViewStyle
  customTextStyle?: TextStyle
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
  testID,
  hasRightArrow,
}) => {
  const { t } = useTranslation()

  const determineGradient = (): string[] => {
    if (disabled || loading) {
      return [Colors.secondary75, Colors.secondary75]
    } else {
      return Colors.gradientPrimary110
    }
  }

  const determineTextStyle = (): TextStyle => {
    if (disabled || loading) {
      return style.textDisabled
    } else {
      return style.text
    }
  }
  const textStyle = { ...determineTextStyle(), ...customTextStyle }

  const determineShadowEnabled = (): ViewStyle => {
    if (disabled || loading) {
      return {}
    } else {
      return style.buttonContainerShadow
    }
  }
  const buttonContainerStyle = {
    ...style.buttonContainer,
    ...determineShadowEnabled(),
    ...customButtonStyle,
  }

  const buttonStyle = {
    ...style.button,
    ...customButtonStyle,
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
        start={{ x: 0.2, y: 0.85 }}
        end={{ x: 0.4, y: 0 }}
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
                fill={disabled ? Colors.black : Colors.white}
                style={style.rightArrow}
                accessible
                accessibilityLabel={t("common.next")}
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
  rightArrow: {
    marginLeft: Spacing.medium,
  },
})
