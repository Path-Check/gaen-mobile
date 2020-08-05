import React, { FunctionComponent } from "react"
import {
  Image,
  StyleSheet,
  View,
  ScrollView,
  ImageSourcePropType,
  ViewStyle,
  TouchableOpacity,
  SafeAreaView,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useTranslation } from "react-i18next"

import { Button } from "../components/Button"
import { GlobalText } from "../components/GlobalText"
import { OnboardingScreens } from "../navigation"

import { Layout, Outlines, Colors, Spacing, Typography } from "../styles"

type ExplanationScreenContent = {
  screenNumber: number
  image: ImageSourcePropType
  imageLabel: string
  header: string
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
  const { t } = useTranslation()
  const navigation = useNavigation()

  const determineCircleStyle = (circlePosition: number): ViewStyle => {
    if (circlePosition == explanationScreenContent.screenNumber) {
      return style.circleActive
    } else {
      return style.circleInactive
    }
  }

  return (
    <SafeAreaView>
      <View>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate(OnboardingScreens.NotificationPermissions)
          }
          style={style.skipButtonContainer}
        >
          <GlobalText style={style.skipButtonText}>
            {t("common.skip")}
          </GlobalText>
        </TouchableOpacity>
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
      </View>
    </SafeAreaView>
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
    marginTop: Spacing.small,
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
    ...Typography.header3,
    marginBottom: Spacing.xxxLarge,
  },
  skipButtonContainer: {
    position: "absolute",
    top: Spacing.small,
    right: Spacing.small,
    padding: Spacing.small,
    zIndex: Layout.zLevel1,
  },
  skipButtonText: {
    ...Typography.base,
    color: Colors.mediumGray,
  },
})

export default ExplanationScreen
