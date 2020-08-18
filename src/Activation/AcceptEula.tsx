import React, { useEffect, useState, FunctionComponent } from "react"
import {
  TouchableOpacity,
  Linking,
  StyleSheet,
  View,
  SafeAreaView,
  ActivityIndicator,
} from "react-native"
import { useTranslation } from "react-i18next"
import loadLocalResource from "react-native-local-resource"
import WebView, { WebViewNavigation } from "react-native-webview"
import { useNavigation } from "@react-navigation/native"
import { SvgXml } from "react-native-svg"

import { Icons } from "../assets"
import { GlobalText } from "../components/GlobalText"
import { ActivationScreens } from "../navigation"
import { Button } from "../components/Button"
import enEulaHtml from "../locales/eula/en.html"
import esPREulaHtml from "../locales/eula/es_PR.html"
import htEulaHtml from "../locales/eula/ht.html"

import { Forms, Iconography, Colors, Spacing, Outlines } from "../styles"
import { useStatusBarEffect } from "../navigation"

const LoadingIndicator = () => {
  return (
    <View style={style.loadingIndicator}>
      <ActivityIndicator size={"large"} color={Colors.neutral100} />
    </View>
  )
}

const DEFAULT_EULA_URL = "about:blank"
type AvailableLocale = "en" | "es_PR" | "ht"

const AcceptEula: FunctionComponent = () => {
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

  const checkboxIcon = boxChecked
    ? Icons.CheckboxChecked
    : Icons.CheckboxUnchecked

  const checkboxLabel = boxChecked
    ? t("label.checked_checkbox")
    : t("label.unchecked_checkbox")

  return (
    <SafeAreaView style={style.container}>
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
      <View style={style.footerContainer}>
        <TouchableOpacity
          style={style.checkboxContainer}
          onPress={() => toggleCheckbox(!boxChecked)}
          accessible
          accessibilityRole="checkbox"
          accessibilityLabel={checkboxLabel}
          testID="accept-terms-of-use-checkbox"
        >
          <SvgXml
            xml={checkboxIcon}
            fill={Colors.primary100}
            width={Iconography.small}
            height={Iconography.small}
          />
          <GlobalText style={style.checkboxText}>
            {t("onboarding.eula_agree_terms_of_use")}
          </GlobalText>
        </TouchableOpacity>
        <Button
          onPress={() =>
            navigation.navigate(ActivationScreens.ActivateProximityTracing)
          }
          disabled={!boxChecked}
          label={t("common.continue")}
        />
      </View>
    </SafeAreaView>
  )
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryLightBackground,
    height: "100%",
  },
  loadingIndicator: {
    justifyContent: "center",
    height: "100%",
  },
  footerContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: Colors.primaryLightBackground,
    paddingTop: Spacing.large,
    paddingBottom: Spacing.huge,
    paddingHorizontal: Spacing.xxLarge,
    borderTopColor: Colors.neutral75,
    borderTopWidth: Outlines.hairline,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: Spacing.xxLarge,
  },
  checkboxText: {
    ...Forms.checkboxText,
    color: Colors.primaryText,
    flex: 1,
    paddingLeft: Spacing.medium,
  },
})

export default AcceptEula
