import React, { ReactNode, FunctionComponent } from "react"
import { Text as RNText, TextStyle } from "react-native"

import { useLanguageDirection } from "../locales/languages"

interface TextProps {
  style?: TextStyle
  testID?: string
  onPress?: () => void
  allowFontScaling?: boolean
  numberOfLines?: number
  ellipsizeMode?: "head" | "middle" | "tail" | "clip"
  children: ReactNode | string
}

const Text: FunctionComponent<TextProps> = ({
  style,
  testID,
  onPress,
  allowFontScaling = true,
  numberOfLines,
  ellipsizeMode = "tail",
  children,
}: TextProps) => {
  const writingDirection = useLanguageDirection()

  return (
    <RNText
      onPress={onPress}
      style={[{ writingDirection }, style]}
      testID={testID}
      allowFontScaling={allowFontScaling}
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
    >
      {children}
    </RNText>
  )
}

export default Text
