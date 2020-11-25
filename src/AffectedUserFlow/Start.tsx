import React, { FunctionComponent } from "react"
import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"
import { SvgXml } from "react-native-svg"

import { useStatusBarEffect, AffectedUserFlowStackScreens } from "../navigation"
import { useCustomCopy } from "../configuration/useCustomCopy"
import { Text } from "../components"

import { Spacing, Colors, Typography, Buttons } from "../styles"
import { Icons, Images } from "../assets"

export const AffectedUserFlowIntro: FunctionComponent = () => {
  useStatusBarEffect("dark-content", Colors.background.primaryLight)
  const { t } = useTranslation()
  const navigation = useNavigation()
  const { healthAuthorityName } = useCustomCopy()

  const handleOnPressNext = () => {
    navigation.navigate(AffectedUserFlowStackScreens.AffectedUserCodeInput)
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
        <Text style={style.headerText}>{t("export.intro.header")}</Text>
        <Text style={style.bodyText}>
          {t("export.intro.body1", { healthAuthorityName })}
        </Text>
        <Text style={style.bodyText}>
          {t("export.intro.body2", { healthAuthorityName })}
        </Text>
      </View>
      <TouchableOpacity
        style={style.button}
        onPress={handleOnPressNext}
        accessibilityLabel={t("common.start")}
      >
        <Text style={style.buttonText}>{t("common.continue")}</Text>
        <SvgXml xml={Icons.Arrow} fill={Colors.background.primaryLight} />
      </TouchableOpacity>
    </ScrollView>
  )
}

const imageSize = 150

const style = StyleSheet.create({
  container: {
    backgroundColor: Colors.background.primaryLight,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: "space-between",
    paddingHorizontal: Spacing.large,
    paddingTop: Spacing.huge,
    paddingBottom: Spacing.massive,
    backgroundColor: Colors.background.primaryLight,
  },
  image: {
    resizeMode: "contain",
    width: imageSize,
    height: imageSize,
    marginBottom: Spacing.small,
  },
  headerText: {
    ...Typography.header.x60,
    marginBottom: Spacing.xLarge,
  },
  bodyText: {
    ...Typography.body.x20,
    marginBottom: Spacing.medium,
  },
  button: {
    ...Buttons.primary.base,
  },
  buttonText: {
    ...Typography.button.primary,
    marginRight: Spacing.small,
  },
})

export default AffectedUserFlowIntro
