import React, { FunctionComponent } from "react"
import { View, StatusBar as RNStatusBar, StyleSheet } from "react-native"
import { useSafeAreaInsets, EdgeInsets } from "react-native-safe-area-context"

interface StatusBarProps {
  backgroundColor: string
}

const StatusBar: FunctionComponent<StatusBarProps> = ({ backgroundColor }) => {
  const insets = useSafeAreaInsets()
  const style = createStyle({ insets, backgroundColor })

  return (
    <View style={style.statusBarContainer}>
      <RNStatusBar />
    </View>
  )
}

type StyleProps = {
  insets: EdgeInsets
  backgroundColor: string
}

const createStyle = ({ insets, backgroundColor }: StyleProps) => {
  /* eslint-disable react-native/no-unused-styles */
  return StyleSheet.create({
    statusBarContainer: {
      height: insets.top,
      backgroundColor: backgroundColor,
    },
  })
}

export default StatusBar
