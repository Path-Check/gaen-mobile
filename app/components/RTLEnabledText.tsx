import React from "react"
import { Text, TextStyle } from "react-native"

import { useLanguageDirection } from "../locales/languages"

import { Typography } from "../styles"

type TypographicUse =
  | "headline1"
  | "headline2"
  | "headline3"
  | "headline4"
  | "headline5"
  | "headline6"
  | "headline7"
  | "body1"
  | "body2"
  | "body3"
  | "body4"

interface RTLEnabledTextProps {
  use?: TypographicUse
  style?: TextStyle
  testID?: string
  children: JSX.Element | string
  onPress?: () => void
}

export const RTLEnabledText = ({
  use = "body1",
  style,
  testID,
  children,
  onPress,
}: RTLEnabledTextProps): JSX.Element => {
  const writingDirection = useLanguageDirection()

  const useToStyle = () => {
    switch (use) {
      case "headline1": {
        return Typography.header1
      }
      case "headline2": {
        return Typography.header2
      }
      case "headline3": {
        return Typography.header3
      }
      case "headline4": {
        return Typography.header4
      }
      case "headline5": {
        return Typography.header5
      }
      case "headline6": {
        return Typography.header6
      }
      case "headline7": {
        return Typography.header7
      }
      case "body1": {
        return Typography.mainContent
      }
      case "body2": {
        return Typography.secondaryContent
      }
      case "body3": {
        return Typography.tertiaryContent
      }
      case "body4": {
        return Typography.quaternaryContent
      }
    }
  }

  const textStyle = useToStyle()

  return (
    <Text
      onPress={onPress}
      style={[textStyle, { writingDirection }, style]}
      testID={testID}
    >
      {children}
    </Text>
  )
}
