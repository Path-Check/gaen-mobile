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

import {
  Spacing,
  Colors,
  Typography,
  Buttons,
  Iconography,
  Layout,
} from "../styles"
import { Icons, Images } from "../assets"

export const AffectedUserFlowIntro: FunctionComponent = () => {
  useStatusBarEffect("dark-content", Colors.background.primaryLight)
  const { t } = useTranslation()
  const navigation = useNavigation()
  const { healthAuthorityName } = useCustomCopy()

  const handleOnPressContinue = () => {
    navigation.navigate(AffectedUserFlowStackScreens.AffectedUserCodeInput)
  }

  const handleOnPressSecondaryButton = () => {
    navigation.navigate(AffectedUserFlowStackScreens.VerificationCodeInfo)
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
      <View>
        <TouchableOpacity
          style={style.button}
          onPress={handleOnPressContinue}
          accessibilityLabel={t("common.start")}
        >
          <Text style={style.buttonText}>{t("common.continue")}</Text>
          <SvgXml xml={Icons.Arrow} fill={Colors.background.primaryLight} />
        </TouchableOpacity>
        <TouchableOpacity
          style={style.secondaryButton}
          onPress={handleOnPressSecondaryButton}
          accessibilityLabel={t("common.start")}
        >
          <SvgXml
            xml={Icons.QuestionMarkInCircle}
            fill={Colors.primary.shade100}
            width={Iconography.xSmall}
            height={Iconography.xSmall}
          />
          <Text style={style.secondaryButtonText}>
            {t("export.intro.what_is_a")}
          </Text>
        </TouchableOpacity>
      </View>
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
    paddingBottom: Spacing.xxLarge,
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
    marginBottom: Spacing.small,
  },
  buttonText: {
    ...Typography.button.primary,
    marginRight: Spacing.small,
  },
  secondaryButton: {
    ...Buttons.secondary.base,
    maxWidth: Layout.screenWidth * 0.65,
    alignSelf: "center",
    justifyContent: "space-between",
  },
  secondaryButtonText: {
    ...Typography.button.secondary,
    textAlign: "left",
    maxWidth: "90%",
  },
})

export default AffectedUserFlowIntro
