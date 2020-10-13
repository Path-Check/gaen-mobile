import React, { ReactNode, FunctionComponent } from "react"
import { Text as RNText, TextStyle } from "react-native"

import { useLanguageDirection } from "../locales/languages"

interface TextProps {
  style?: TextStyle
  testID?: string
  onPress?: () => void
  children: ReactNode | string
}

const Text: FunctionComponent<TextProps> = ({
  style,
  testID,
  children,
  onPress,
}: TextProps) => {
  const writingDirection = useLanguageDirection()

  return (
    <RNText
      onPress={onPress}
      style={[{ writingDirection }, style]}
      testID={testID}
    >
      {children}
    </RNText>
  )
}

export default Text
