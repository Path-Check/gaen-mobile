import React from "react"
import {
  ImageBackground,
  StyleSheet,
  TextStyle,
  View,
  ScrollView,
  ImageSourcePropType,
  ViewStyle,
} from "react-native"
import { SvgXml } from "react-native-svg"

import { Button } from "../components/Button"
import { useStatusBarEffect } from "../navigation"
import { GlobalText } from "../components/GlobalText"

import { Buttons, Colors, Spacing, Iconography, Typography } from "../styles"

export enum IconStyle {
  Blue,
  Gold,
}

type ExplanationScreenContent = {
  icon: string
  iconLabel: string
  header: string
  body: string
  primaryButtonLabel: string
  backgroundImage: ImageSourcePropType
  secondaryButtonLabel?: string
}

type ExplanationScreenStyles = {
  headerStyle?: TextStyle
  bodyStyle?: TextStyle
  primaryButtonContainerStyle?: ViewStyle
  primaryButtonTextStyle?: TextStyle
  secondaryButtonContainerStyle?: ViewStyle
  secondaryButtonTextStyle?: TextStyle
  backgroundStyle?: ViewStyle
  iconStyle: IconStyle
}

type ExplanationScreenActions = {
  primaryButtonOnPress: () => void
  secondaryButtonOnPress?: () => void
}

interface ExplanationScreenProps {
  explanationScreenContent: ExplanationScreenContent
  explanationScreenStyles: ExplanationScreenStyles
  explanationScreenActions: ExplanationScreenActions
}

const ExplanationScreen = ({
  explanationScreenContent,
  explanationScreenStyles,
  explanationScreenActions,
}: ExplanationScreenProps): JSX.Element => {
  useStatusBarEffect("dark-content")

  const determineIconStyle = (iconStyle: IconStyle): ViewStyle => {
    switch (iconStyle) {
      case IconStyle.Blue:
        return style.blueIcon
      case IconStyle.Gold:
        return style.goldIcon
    }
  }

  const primaryButtonTextStyles = {
    ...style.primaryButtonText,
    ...explanationScreenStyles.primaryButtonTextStyle,
  }

  const secondaryButtonTextStyles = {
    ...style.secondaryButtonText,
    ...explanationScreenStyles.secondaryButtonTextStyle,
  }

  const headerStyles = {
    ...style.headerText,
    ...explanationScreenStyles.headerStyle,
  }

  const contentStyles = {
    ...style.contentText,
    ...explanationScreenStyles.bodyStyle,
  }

  const primaryButtonStyles = {
    ...style.primaryButton,
    ...explanationScreenStyles.primaryButtonContainerStyle,
  }

  const secondaryButtonStyles = {
    ...style.secondaryButton,
    ...explanationScreenStyles.secondaryButtonContainerStyle,
  }

  return (
    <View style={style.outerContainer}>
      <ImageBackground
        source={explanationScreenContent.backgroundImage}
        style={[style.background, explanationScreenStyles.backgroundStyle]}
      />
      <View style={style.content}>
        <ScrollView
          alwaysBounceVertical={false}
          style={style.innerContainer}
          contentContainerStyle={{ paddingBottom: Spacing.large }}
        >
          <View style={determineIconStyle(explanationScreenStyles.iconStyle)}>
            <SvgXml
              xml={explanationScreenContent.icon}
              accessible
              accessibilityLabel={explanationScreenContent.iconLabel}
            />
          </View>
          <GlobalText style={headerStyles}>
            {explanationScreenContent.header}
          </GlobalText>
          <GlobalText style={contentStyles}>
            {explanationScreenContent.body}
          </GlobalText>
        </ScrollView>
        <Button
          label={explanationScreenContent.primaryButtonLabel}
          onPress={explanationScreenActions.primaryButtonOnPress}
          buttonStyle={primaryButtonStyles}
          textStyle={primaryButtonTextStyles}
        />
        {explanationScreenActions.secondaryButtonOnPress &&
          explanationScreenContent.secondaryButtonLabel && (
            <Button
              label={explanationScreenContent.secondaryButtonLabel}
              onPress={explanationScreenActions.secondaryButtonOnPress}
              buttonStyle={secondaryButtonStyles}
              textStyle={secondaryButtonTextStyles}
            />
          )}
      </View>
    </View>
  )
}

const style = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: Colors.primaryBackground,
  },
  innerContainer: {
    paddingVertical: Spacing.large,
  },
  background: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    position: "absolute",
  },
  blueIcon: {
    ...Iconography.largeBlueIcon,
    marginBottom: Spacing.xHuge,
  },
  goldIcon: {
    ...Iconography.largeGoldIcon,
    marginBottom: Spacing.xHuge,
  },
  content: {
    flex: 1,
    padding: Spacing.large,
  },
  headerText: {
    ...Typography.header2,
  },
  contentText: {
    ...Typography.mainContent,
    color: Colors.secondaryViolet,
    marginTop: Spacing.xLarge,
  },
  primaryButton: {
    ...Buttons.largeSecondaryBlue,
  },
  secondaryButton: {
    ...Buttons.largeTransparent,
  },
  primaryButtonText: {
    ...Typography.buttonTextLight,
  },
  secondaryButtonText: {
    ...Typography.buttonTextLight,
  },
})

export default ExplanationScreen
