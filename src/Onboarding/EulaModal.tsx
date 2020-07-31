import React, { useEffect, useState, FunctionComponent } from "react"
import {
  TouchableOpacity,
  Linking,
  StyleSheet,
  View,
  SafeAreaView,
  ActivityIndicator,
  Image,
} from "react-native"
import { useTranslation } from "react-i18next"
import loadLocalResource from "react-native-local-resource"
import WebView, { WebViewNavigation } from "react-native-webview"
import { SvgXml } from "react-native-svg"
import { useNavigation } from "@react-navigation/native"

import { Images } from "../assets"
import { GlobalText } from "../components/GlobalText"
import enEulaHtml from "../locales/eula/en.html"
import esPREulaHtml from "../locales/eula/es_PR.html"
import htEulaHtml from "../locales/eula/ht.html"
import { OnboardingScreens } from "../navigation"

import { Icons } from "../assets"
import {
  Buttons,
  Typography,
  Forms,
  Layout,
  Colors,
  Iconography,
  Spacing,
  Outlines,
} from "../styles"
import { useStatusBarEffect } from "../navigation"

const LoadingIndicator = () => {
  return (
    <View style={style.loadingIndicator}>
      <ActivityIndicator size={"large"} color={Colors.darkGray} />
    </View>
  )
}

const DEFAULT_EULA_URL = "about:blank"
type AvailableLocale = "en" | "es_PR" | "ht"

const EulaModal: FunctionComponent = () => {
  useStatusBarEffect("dark-content")
  const [html, setHtml] = useState<string | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)
  const [boxChecked, toggleCheckbox] = useState(false)
  const {
    t,
    i18n: { language: localeCode },
  } = useTranslation()
  const navigation = useNavigation()

  const EULA_FILES: Record<AvailableLocale, string> = {
    ["en"]: enEulaHtml,
    ["es_PR"]: esPREulaHtml,
    ["ht"]: htEulaHtml,
  }
  const eulaPath = EULA_FILES[localeCode as AvailableLocale] || enEulaHtml

  const checkboxImage = boxChecked
    ? Images.BoxCheckedIcon
    : Images.BoxUncheckedIcon

  const shouldStartLoadWithRequestHandler = (
    webViewState: WebViewNavigation,
  ) => {
    let shouldLoadRequest = true
    if (webViewState.url !== DEFAULT_EULA_URL) {
      Linking.openURL(webViewState.url)
      shouldLoadRequest = false
    }
    return shouldLoadRequest
  }

  useEffect(() => {
    const loadEula = async () => {
      setHtml(await loadLocalResource(eulaPath))
    }
    loadEula()
  }, [eulaPath])

  return (
    <View style={style.container}>
      <SafeAreaView style={style.mainContainer}>
        <TouchableOpacity
          accessibilityLabel={t("label.close")}
          accessible
          style={style.closeIcon}
          onPress={navigation.goBack}
        >
          <SvgXml
            color={Colors.icon}
            xml={Icons.Close}
            width={Iconography.xSmall}
            height={Iconography.xSmall}
          />
        </TouchableOpacity>
        {html && (
          <>
            <WebView
              onLoad={() => setIsLoading(false)}
              source={{ html }}
              onShouldStartLoadWithRequest={shouldStartLoadWithRequestHandler}
            />
            {isLoading ? <LoadingIndicator /> : null}
          </>
        )}
      </SafeAreaView>

      <View style={style.footerContainer}>
        <TouchableOpacity
          style={style.checkboxContainer}
          onPress={() => toggleCheckbox(!boxChecked)}
          accessible
          accessibilityRole="checkbox"
          accessibilityLabel={t("label.checkbox")}
          testID="accept-terms-of-use-checkbox"
        >
          <Image source={checkboxImage} style={style.checkboxIcon} />
          <GlobalText style={style.checkboxText}>
            {t("onboarding.eula_agree_terms_of_use")}
          </GlobalText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate(OnboardingScreens.PersonalPrivacy)}
          style={boxChecked ? style.button : style.disabledButton}
          disabled={!boxChecked}
        >
          <GlobalText
            style={boxChecked ? style.buttonText : style.disabledButtonText}
          >
            {t("common.continue")}
          </GlobalText>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    height: "100%",
  },
  mainContainer: {
    flex: 1,
  },
  closeIcon: {
    position: "absolute",
    zIndex: Layout.zLevel1,
    borderRadius: Outlines.borderRadiusMax,
    backgroundColor: Colors.secondaryBackground,
    width: Iconography.medium,
    height: Iconography.medium,
    alignItems: "center",
    justifyContent: "center",
    right: Spacing.medium,
    top: Spacing.xHuge,
  },
  loadingIndicator: {
    justifyContent: "center",
    height: "100%",
  },
  footerContainer: {
    backgroundColor: Colors.primaryViolet,
    padding: Spacing.medium,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.medium,
  },
  checkboxIcon: {
    ...Forms.checkboxIcon,
  },
  checkboxText: {
    ...Forms.checkboxText,
    flex: 1,
    paddingLeft: Spacing.medium,
  },
  button: {
    ...Buttons.primaryInverted,
  },
  disabledButton: {
    ...Buttons.primaryInvertedDisabled,
    backgroundColor: Colors.lighterGray,
  },
  buttonText: {
    ...Typography.buttonPrimaryInvertedText,
  },
  disabledButtonText: {
    ...Typography.buttonPrimaryInvertedDisabledText,
    color: Colors.mediumGray,
  },
})

export default EulaModal
