import React from "react"
import { Text, TextStyle } from "react-native"

import { useLanguageDirection } from "../locales/languages"

interface GlobalTextProps {
  style?: TextStyle
  testID?: string
  onPress?: () => void
  children: JSX.Element | string
}

export const GlobalText = ({
  style,
  testID,
  children,
  onPress,
}: GlobalTextProps): JSX.Element => {
  const writingDirection = useLanguageDirection()

  return (
    <Text
      onPress={onPress}
      style={[{ writingDirection }, style]}
      testID={testID}
    >
      {children}
    </Text>
  )
}
