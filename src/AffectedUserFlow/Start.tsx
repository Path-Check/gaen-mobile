import React, { FunctionComponent } from "react"
import {
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"
import { SvgXml } from "react-native-svg"
import env from "react-native-config"

import { useStatusBarEffect, AffectedUserFlowStackScreens } from "../navigation"
import { useCustomCopy } from "../configuration/useCustomCopy"
import { Text } from "../components"

import { Spacing, Colors, Typography, Buttons, Iconography } from "../styles"
import { Icons, Images } from "../assets"
import { useConfigurationContext } from "../ConfigurationContext"

export const AffectedUserFlowIntro: FunctionComponent = () => {
  useStatusBarEffect("dark-content", Colors.background.primaryLight)
  const { t } = useTranslation()
  const {
    displayRequestCallbackUrl,
    supportPhoneNumber,
  } = useConfigurationContext()
  const navigation = useNavigation()
  const { healthAuthorityName } = useCustomCopy()

  const handleOnPressCallback = () => {
    const url = env.CALLBACK_REQUEST_FORM_URL
    if (url) {
      Linking.openURL(url)
    }
  }

  const handleOnPressContinue = () => {
    navigation.navigate(AffectedUserFlowStackScreens.AffectedUserCodeInput)
  }

  const handleOnPressSecondaryButton = () => {
    navigation.navigate(AffectedUserFlowStackScreens.VerificationCodeInfo)
  }

  const renderText = () => {
    if (displayRequestCallbackUrl) {
      return t("callback_request.verification_code_warning", {
        healthAuthorityName,
      })
    } else {
      return t("export.intro.body2", { healthAuthorityName })
    }
  }

  const handleOnPressSupportNumber = () => {
    Linking.openURL(`tel:${supportPhoneNumber}`)
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
          {renderText()}
          {displayRequestCallbackUrl && (
            <Pressable
              onPress={handleOnPressSupportNumber}
              style={style.supportNumberButton}
            >
              <Text style={style.supportNumberButtonText}>
                {supportPhoneNumber}
              </Text>
            </Pressable>
          )}
          {displayRequestCallbackUrl && (
            <Text style={style.bodyText}>
              {t("callback_request.verification_code_warning2")}
            </Text>
          )}
        </Text>
      </View>
      <View>
        {displayRequestCallbackUrl && (
          <TouchableOpacity
            style={style.button}
            onPress={handleOnPressCallback}
            accessibilityHint={t("accessibility.hint.navigates_to_new_screen")}
            accessibilityRole="button"
            accessibilityLabel={t("common.request_callback")}
          >
            <Text style={style.buttonText}>{t("common.request_callback")}</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={style.button}
          onPress={handleOnPressContinue}
          accessibilityHint={t("accessibility.hint.navigates_to_new_screen")}
          accessibilityRole="button"
          accessibilityLabel={t("common.continue")}
        >
          <Text style={style.buttonText}>{t("common.continue")}</Text>
          <SvgXml xml={Icons.Arrow} fill={Colors.background.primaryLight} />
        </TouchableOpacity>
        <TouchableOpacity
          style={style.secondaryButton}
          onPress={handleOnPressSecondaryButton}
          accessibilityHint={t("accessibility.hint.navigates_to_new_screen")}
          accessibilityLabel={t("export.intro.what_is_a")}
        >
          <View style={style.secondaryButtonIconContainer}>
            <SvgXml
              xml={Icons.QuestionMark}
              fill={Colors.primary.shade125}
              width={Iconography.xxxSmall}
              height={Iconography.xxxSmall}
            />
          </View>
          <Text style={style.secondaryButtonText}>
            {t("export.intro.what_is_a")}
          </Text>
        </TouchableOpacity>
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
  secondaryButton: {
    ...Buttons.secondary.leftIcon,
  },
  secondaryButtonIconContainer: {
    ...Buttons.circle.base,
  },
  secondaryButtonText: {
    ...Typography.button.secondaryLeftIcon,
  },
  supportNumberButton: {
    marginTop: -5,
    paddingVertical: Spacing.tiny,
  },
  supportNumberButtonText: {
    ...Typography.button.anchorLink,
  },
})

export default AffectedUserFlowIntro
