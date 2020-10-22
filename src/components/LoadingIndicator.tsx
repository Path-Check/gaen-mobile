import React, { FunctionComponent } from "react"
import { ActivityIndicator, StyleSheet, View } from "react-native"
import { useHeaderHeight } from "@react-navigation/stack"

import { Colors, Layout, Outlines } from "../styles"

const LoadingIndicator: FunctionComponent = () => {
  const headerHeight = useHeaderHeight()
  const style = createStyle(headerHeight)

  return (
    <View style={style.activityIndicatorContainer}>
      <ActivityIndicator
        size={"large"}
        color={Colors.neutral.shade100}
        style={style.activityIndicator}
        testID={"loading-indicator"}
      />
    </View>
  )
}

const indicatorWidth = 120
const createStyle = (headerHeight: number) => {
  /* eslint-disable react-native/no-unused-styles */

  return StyleSheet.create({
    activityIndicatorContainer: {
      position: "absolute",
      left: Layout.halfWidth,
      top: Layout.halfHeight - headerHeight,
      marginLeft: -(indicatorWidth / 2),
      marginTop: -(indicatorWidth / 2),
      zIndex: Layout.zLevel2,
    },
    activityIndicator: {
      width: indicatorWidth,
      height: indicatorWidth,
      backgroundColor: Colors.transparent.neutral30,
      borderRadius: Outlines.baseBorderRadius,
    },
  })
}

export default LoadingIndicator
