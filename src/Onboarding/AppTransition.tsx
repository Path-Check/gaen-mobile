import React, { FunctionComponent } from "react"
import { Image, Pressable, ScrollView, StyleSheet, View } from "react-native"
import { useTranslation } from "react-i18next"
import { SvgXml } from "react-native-svg"

import { useStatusBarEffect } from "../navigation"
import { Text } from "../components"
import { useCustomCopy } from "../configuration/useCustomCopy"
import { useOnboardingNavigation } from "./useOnboardingNavigation"

import { Spacing, Colors, Typography, Buttons } from "../styles"
import { Icons, Images } from "../assets"

const AppTransition: FunctionComponent = () => {
  useStatusBarEffect("dark-content", Colors.background.primaryLight)
  const { t } = useTranslation()
  const { goToNextScreenFrom } = useOnboardingNavigation()
  const { appTransition } = useCustomCopy()

  const headerText = appTransition?.header || "[ No header found ]"
  const body1Text = appTransition?.body1 || "[ No body1 found ]"
  const body2Text = appTransition?.body2 || "[ No body2 found ]"

  const handleOnPressContinue = () => {
    goToNextScreenFrom("AppTransition")
  }

  return (
    <ScrollView
      style={style.container}
      contentContainerStyle={style.contentContainer}
      alwaysBounceVertical={false}
    >
      <View>
        <Image
          source={Images.HowItWorksValueProposition}
          style={style.image}
          accessible
          accessibilityLabel={t("export.person_and_health_expert")}
        />
        <Text style={style.headerText}>{headerText}</Text>
        <Text style={style.bodyText}>{body1Text}</Text>
        <Text style={style.bodyText}>{body2Text}</Text>
      </View>
      <View>
        <Pressable
          style={style.button}
          onPress={handleOnPressContinue}
          accessibilityLabel={t("common.continue")}
        >
          <Text style={style.buttonText}>{t("common.continue")}</Text>
          <SvgXml xml={Icons.Arrow} fill={Colors.background.primaryLight} />
        </Pressable>
      </View>
    </ScrollView>
  )
}

const imageSize = 140

const style = StyleSheet.create({
  container: {
    backgroundColor: Colors.background.primaryLight,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: "space-between",
    paddingHorizontal: Spacing.large,
    paddingBottom: Spacing.xxLarge,
    backgroundColor: Colors.background.primaryLight,
  },
  image: {
    resizeMode: "contain",
    width: imageSize,
    height: imageSize,
    marginBottom: Spacing.xSmall,
  },
  headerText: {
    ...Typography.header.x60,
    marginBottom: Spacing.small,
  },
  bodyText: {
    ...Typography.body.x30,
    marginBottom: Spacing.medium,
  },
  button: {
    ...Buttons.primary.base,
    marginBottom: Spacing.small,
  },
  buttonText: {
    ...Typography.button.primary,
    marginRight: Spacing.small,
  },
})

export default AppTransition
