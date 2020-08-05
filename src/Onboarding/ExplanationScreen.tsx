import React, { FunctionComponent } from "react"
import {
  Image,
  StyleSheet,
  View,
  ScrollView,
  ImageSourcePropType,
  ViewStyle,
} from "react-native"

import { Button } from "../components/Button"
import { GlobalText } from "../components/GlobalText"

import { Outlines, Colors, Spacing, Typography } from "../styles"

type ExplanationScreenContent = {
  screenNumber: number
  image: ImageSourcePropType
  imageLabel: string
  header: string
  body: string
  primaryButtonLabel: string
}

type ExplanationScreenActions = {
  primaryButtonOnPress: () => void
}

interface ExplanationScreenProps {
  explanationScreenContent: ExplanationScreenContent
  explanationScreenActions: ExplanationScreenActions
}

const ExplanationScreen: FunctionComponent<ExplanationScreenProps> = ({
  explanationScreenContent,
  explanationScreenActions,
}: ExplanationScreenProps) => {
  const determineCircleStyle = (circlePosition: number): ViewStyle => {
    if (circlePosition == explanationScreenContent.screenNumber) {
      return style.circleActive
    } else {
      return style.circleInactive
    }
  }

  return (
    <ScrollView
      alwaysBounceVertical={false}
      style={style.container}
      contentContainerStyle={style.contentContainer}
    >
      <View>
        <Image
          source={explanationScreenContent.image}
          accessibilityLabel={explanationScreenContent.imageLabel}
          accessible
          style={style.image}
          resizeMode={"contain"}
        />
        <View style={style.circles}>
          <View style={determineCircleStyle(1)} />
          <View style={determineCircleStyle(2)} />
          <View style={determineCircleStyle(3)} />
          <View style={determineCircleStyle(4)} />
          <View style={determineCircleStyle(5)} />
        </View>
        <GlobalText style={style.headerText}>
          {explanationScreenContent.header}
        </GlobalText>
      </View>
      <Button
        hasRightArrow
        label={explanationScreenContent.primaryButtonLabel}
        onPress={explanationScreenActions.primaryButtonOnPress}
      />
    </ScrollView>
  )
}

const style = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.large,
  },
  contentContainer: {
    height: "100%",
    paddingBottom: Spacing.large,
  },
  image: {
    width: "100%",
    height: 300,
    marginBottom: Spacing.medium,
  },
  circleActive: {
    backgroundColor: Colors.primaryBlue,
    width: 10,
    height: 10,
    borderRadius: Outlines.borderRadiusMax,
  },
  circles: {
    flexDirection: "row",
    alignItems: "center",
    width: 100,
    justifyContent: "space-between",
    marginBottom: Spacing.medium,
  },
  circleInactive: {
    backgroundColor: Colors.lighterGray,
    width: 5,
    height: 5,
    borderRadius: Outlines.borderRadiusMax,
  },
  headerText: {
    ...Typography.header2,
    marginBottom: Spacing.xxxLarge,
  },
})

export default ExplanationScreen

