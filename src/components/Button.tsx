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
  const { t } = useTranslation()

  const determineGradient = (): string[] => {
    const baseGradient = [Colors.primaryBlue, Colors.secondaryViolet]
    const disabledGradient = [Colors.darkestGray, Colors.mediumGray]
    const invertedGradient = [Colors.quaternaryViolet, Colors.white]
    const invertedDisabledGradient = [Colors.mediumGray, Colors.lighterGray]

    if (invert && (disabled || loading)) {
      return invertedDisabledGradient
    } else if (invert && !(disabled || loading)) {
      return invertedGradient
    } else if (!invert && (disabled || loading)) {
      return disabledGradient
    } else {
      return baseGradient
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

  const determineButtonContainerStyle = (): ViewStyle => {
    if (disabled || loading) {
      return {}
    } else {
      return style.buttonContainerEnabled
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
      style={determineButtonContainerStyle()}
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
                fill={Colors.white}
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
  buttonContainerEnabled: {
    ...Outlines.baseShadow,
  },
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
