import React, { FunctionComponent } from "react"
import { ActivityIndicator, StyleSheet, View } from "react-native"

import { Colors, Layout, Outlines } from "../styles"

const LoadingIndicator: FunctionComponent = () => {
  return (
    <View style={style.activityIndicatorContainer}>
      <ActivityIndicator
        size={"large"}
        color={Colors.neutral100}
        style={style.activityIndicator}
        testID={"loading-indicator"}
      />
    </View>
  )
}

const indicatorWidth = 120
const style = StyleSheet.create({
  activityIndicatorContainer: {
    position: "absolute",
    left: Layout.halfWidth,
    top: Layout.halfHeight,
    marginLeft: -(indicatorWidth / 2),
    marginTop: -(indicatorWidth / 2),
    zIndex: Layout.zLevel2,
  },
  activityIndicator: {
    width: indicatorWidth,
    height: indicatorWidth,
    backgroundColor: Colors.transparentNeutral30,
    borderRadius: Outlines.baseBorderRadius,
  },
})

export default LoadingIndicator
