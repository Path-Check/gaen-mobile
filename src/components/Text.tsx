import React, { ReactNode, FunctionComponent } from "react"
import { Text as RNText, TextStyle } from "react-native"

import { useLanguageDirection } from "../locales/languages"

interface TextProps {
  style?: TextStyle
  testID?: string
  onPress?: () => void
  allowFontScaling?: boolean
  children: ReactNode | string
}

const Text: FunctionComponent<TextProps> = ({
  style,
  testID,
  children,
  onPress,
  allowFontScaling = true,
}: TextProps) => {
  const writingDirection = useLanguageDirection()

  return (
    <RNText
      onPress={onPress}
      style={[{ writingDirection }, style]}
      testID={testID}
      allowFontScaling={allowFontScaling}
    >
      {children}
    </RNText>
  )
}

export default Text
