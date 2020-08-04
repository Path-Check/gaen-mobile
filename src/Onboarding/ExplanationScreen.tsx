import React, { FunctionComponent } from "react"
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
import { useStatusBarEffect, StatusBarStyle } from "../navigation"
import { GlobalText } from "../components/GlobalText"

import {
  Outlines,
  Buttons,
  Colors,
  Spacing,
  Iconography,
  Typography,
} from "../styles"

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
  statusBarStyle: StatusBarStyle
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

const ExplanationScreen: FunctionComponent<ExplanationScreenProps> = ({
  explanationScreenContent,
  explanationScreenStyles,
  explanationScreenActions,
}: ExplanationScreenProps) => {
  useStatusBarEffect(explanationScreenStyles.statusBarStyle)

  const determineIconStyle = (iconStyle: IconStyle): ViewStyle => {
    switch (iconStyle) {
      case IconStyle.Blue:
        return { ...style.icon, ...style.blueIcon }
      case IconStyle.Gold:
        return { ...style.icon, ...style.goldIcon }
    }
  }

  const headerStyles = {
    ...style.headerText,
    ...explanationScreenStyles.headerStyle,
  }

  const contentStyles = {
    ...style.contentText,
    ...explanationScreenStyles.bodyStyle,
  }

  const secondaryButtonStyles = {
    ...style.secondaryButton,
    ...explanationScreenStyles.secondaryButtonContainerStyle,
  }

  const secondaryButtonTextStyles = {
    ...style.secondaryButtonText,
    ...explanationScreenStyles.secondaryButtonTextStyle,
  }

  return (
    <View>
      <ImageBackground
        source={explanationScreenContent.backgroundImage}
        style={[style.background, explanationScreenStyles.backgroundStyle]}
      />
      <View style={style.content}>
        <ScrollView
          alwaysBounceVertical={false}
          contentContainerStyle={style.innerContentContainer}
        >
          <View>
            <View style={determineIconStyle(explanationScreenStyles.iconStyle)}>
              <SvgXml
                xml={explanationScreenContent.icon}
                accessible
                accessibilityLabel={explanationScreenContent.iconLabel}
                width={Iconography.medium}
              />
            </View>
            <GlobalText style={headerStyles}>
              {explanationScreenContent.header}
            </GlobalText>
            <GlobalText style={contentStyles}>
              {explanationScreenContent.body}
            </GlobalText>
          </View>
          <View>
            <Button
              label={explanationScreenContent.primaryButtonLabel}
              onPress={explanationScreenActions.primaryButtonOnPress}
              customButtonStyle={
                explanationScreenStyles.primaryButtonContainerStyle
              }
              customTextStyle={explanationScreenStyles.primaryButtonTextStyle}
            />
            {explanationScreenActions.secondaryButtonOnPress &&
              explanationScreenContent.secondaryButtonLabel && (
                <Button
                  label={explanationScreenContent.secondaryButtonLabel}
                  onPress={explanationScreenActions.secondaryButtonOnPress}
                  customButtonStyle={secondaryButtonStyles}
                  customTextStyle={secondaryButtonTextStyles}
                />
              )}
          </View>
        </ScrollView>
      </View>
    </View>
  )
}

const style = StyleSheet.create({
  background: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    position: "absolute",
  },
  innerContentContainer: {
    height: "100%",
    justifyContent: "space-between",
    paddingBottom: Spacing.large,
  },
  icon: {
    ...Iconography.largeIcon,
    borderRadius: Outlines.borderRadiusMax,
    marginTop: Spacing.xxHuge,
    marginBottom: Spacing.large,
  },
  blueIcon: {
    backgroundColor: Colors.tertiaryViolet,
  },
  goldIcon: {
    backgroundColor: Colors.secondaryYellow,
  },
  content: {
    paddingHorizontal: Spacing.large,
  },
  headerText: {
    ...Typography.header2,
  },
  contentText: {
    ...Typography.mainContent,
    color: Colors.secondaryViolet,
    marginTop: Spacing.medium,
  },
  secondaryButton: {
    ...Buttons.secondary,
  },
  secondaryButtonText: {
    ...Typography.buttonSecondaryInvertedText,
  },
})

export default ExplanationScreen
