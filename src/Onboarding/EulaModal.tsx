import React, { useEffect, useState, FunctionComponent } from "react"
import {
  TouchableOpacity,
  Linking,
  Modal,
  StyleSheet,
  View,
  SafeAreaView,
  StatusBar,
  Image,
} from "react-native"
import { useTranslation } from "react-i18next"
import loadLocalResource from "react-native-local-resource"
import WebView, { WebViewNavigation } from "react-native-webview"
import { SvgXml } from "react-native-svg"

import { Button, RTLEnabledText } from "../components"
import en from "../locales/eula/en.html"
import es_PR from "../locales/eula/es_PR.html"
import ht from "../locales/eula/ht.html"

import { Icons, Images } from "../assets"
import { Spacing, Buttons, Colors, Typography, Forms } from "../styles"

type CloseModalIconProps = {
  closeModal: () => void
  label: string
}

const CloseModalIcon: FunctionComponent<CloseModalIconProps> = ({
  closeModal,
  label,
}) => {
  const size = 20
  return (
    <TouchableOpacity
      accessibilityLabel={label}
      accessible
      style={styles.closeIcon}
      onPress={closeModal}
    >
      <SvgXml
        color={Colors.icon}
        xml={Icons.Close}
        width={size}
        height={size}
      />
    </TouchableOpacity>
  )
}

interface CheckboxProps {
  label: string
  onPress: () => void
  checked?: boolean
}

const Checkbox: FunctionComponent<CheckboxProps> = ({
  label,
  onPress,
  checked,
}) => {
  return (
    <TouchableOpacity
      style={styles.checkbox}
      onPress={onPress}
      accessible
      accessibilityRole="checkbox"
      accessibilityLabel={label}
    >
      <Image
        source={checked ? Images.BoxCheckedIcon : Images.BoxUncheckedIcon}
        style={styles.checkboxIcon}
      />
      <RTLEnabledText style={styles.checkboxText}>{label}</RTLEnabledText>
    </TouchableOpacity>
  )
}

const DEFAULT_EULA_URL = "about:blank"

type AvailableLocale = "en" | "es_PR" | "ht"

const EULA_FILES: Record<AvailableLocale, string> = {
  ["en"]: en,
  ["es_PR"]: es_PR,
  ["ht"]: ht,
}

type EulaModalProps = {
  selectedLocale: string
  continueFunction: () => void
}

const EulaModal: FunctionComponent<EulaModalProps> = ({
  selectedLocale,
  continueFunction,
}) => {
  const [modalVisible, setModalVisibility] = useState(false)
  const [boxChecked, toggleCheckbox] = useState(false)
  const [html, setHtml] = useState<string | undefined>(undefined)
  const { t } = useTranslation()

  // Pull the EULA in the correct language, with en as fallback
  const eulaPath = EULA_FILES[selectedLocale as AvailableLocale] || en

  // Any links inside the EULA should launch a separate browser otherwise you can get stuck inside the app
  const shouldStartLoadWithRequestHandler = (
    webViewState: WebViewNavigation,
  ) => {
    let shouldLoadRequest = true
    if (webViewState.url !== DEFAULT_EULA_URL) {
      // If the webpage to load isn't the EULA, load it in a separate browser
      Linking.openURL(webViewState.url)
      // Don't load the page if its being handled in a separate browser
      shouldLoadRequest = false
    }
    return shouldLoadRequest
  }

  // Load the EULA from disk
  useEffect(() => {
    const loadEula = async () => {
      setHtml(await loadLocalResource(eulaPath))
    }
    loadEula()
  }, [selectedLocale, setHtml, eulaPath])

  const canContinue = boxChecked

  const handleOnPressGetStarted = () => setModalVisibility(true)
  return (
    <>
      <TouchableOpacity style={styles.button} onPress={handleOnPressGetStarted}>
        <RTLEnabledText style={styles.buttonText}>
          {t("label.launch_get_started")}
        </RTLEnabledText>
      </TouchableOpacity>
      <Modal animationType="slide" transparent visible={modalVisible}>
        <View style={styles.container}>
          <StatusBar barStyle={"dark-content"} />
          <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 7, paddingHorizontal: 5 }}>
              <CloseModalIcon
                label={t("label.close_icon")}
                closeModal={() => setModalVisibility(false)}
              />
              {html && (
                <WebView
                  style={{ flex: 1 }}
                  source={{ html }}
                  onShouldStartLoadWithRequest={
                    shouldStartLoadWithRequestHandler
                  }
                />
              )}
            </View>
          </SafeAreaView>
          <SafeAreaView style={{ backgroundColor: Colors.secondaryBlue }}>
            <View style={styles.ctaBox}>
              <View style={styles.checkboxContainer}>
                <Checkbox
                  label={t("onboarding.eula_checkbox")}
                  onPress={() => toggleCheckbox(!boxChecked)}
                  checked={boxChecked}
                />
                <RTLEnabledText style={styles.smallDescriptionText}>
                  {t("onboarding.eula_message")}
                </RTLEnabledText>
              </View>
              <Button
                label={t("onboarding.eula_continue")}
                disabled={!canContinue}
                onPress={() => {
                  setModalVisibility(false)
                  continueFunction()
                }}
              />
            </View>
          </SafeAreaView>
        </View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  // Container covers the entire screen
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    color: Colors.primaryText,
    backgroundColor: Colors.white,
  },
  ctaBox: {
    padding: Spacing.medium,
    backgroundColor: Colors.secondaryBlue,
  },
  checkboxContainer: {
    paddingBottom: Spacing.medium,
  },
  closeIcon: {
    padding: Spacing.xSmall,
    alignSelf: "flex-end",
    alignItems: "center",
    alignContent: "center",
  },
  smallDescriptionText: {
    ...Typography.label,
    color: Colors.invertedText,
  },
  button: {
    ...Buttons.largeWhite,
  },
  buttonText: {
    ...Typography.buttonTextDark,
  },
  checkbox: {
    ...Forms.checkbox,
  },
  checkboxIcon: {
    ...Forms.checkboxIcon,
  },
  checkboxText: {
    ...Forms.checkboxText,
  },
})

export default EulaModal
