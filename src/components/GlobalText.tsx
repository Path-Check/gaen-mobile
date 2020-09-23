import React, { ReactNode, FunctionComponent } from "react"
import { Text, TextStyle } from "react-native"

import { useLanguageDirection } from "../locales/languages"

interface GlobalTextProps {
  style?: TextStyle
  testID?: string
  onPress?: () => void
  children: ReactNode | string
}

const GlobalText: FunctionComponent<GlobalTextProps> = ({
  style,
  testID,
  children,
  onPress,
}: GlobalTextProps) => {
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

export default GlobalText
