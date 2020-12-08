import React, { FunctionComponent, useState } from "react"
import {
  Alert,
  StyleSheet,
  TextInput,
  View,
  Keyboard,
  TouchableOpacity,
} from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import { useNavigation } from "@react-navigation/native"
import { useTranslation } from "react-i18next"
import { showMessage } from "react-native-flash-message"
import { SvgXml } from "react-native-svg"

import { useEscrowVerificationContext } from "./EscrowVerificationContext"
import { useProductAnalyticsContext } from "../ProductAnalytics/Context"
import { useStatusBarEffect, EscrowVerificationRoutes } from "../navigation"
import { Text, LoadingIndicator } from "../components"
import * as API from "./API"
import Logger from "../logger"

import {
  Affordances,
  Spacing,
  Forms,
  Colors,
  Typography,
  Buttons,
  Iconography,
} from "../styles"
import { Icons } from "../assets"

const defaultErrorMessage = ""

const VerificationCodeForm: FunctionComponent = () => {
  useStatusBarEffect("dark-content", Colors.background.primaryLight)
  const { t } = useTranslation()
  const navigation = useNavigation()
  const { trackEvent } = useProductAnalyticsContext()
  const { successFlashMessageOptions } = Affordances.useFlashMessageOptions()

  const { testDate } = useEscrowVerificationContext()
  const [code, setCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(defaultErrorMessage)
  const [isFocused, setIsFocused] = useState(false)

  const handleOnChangeText = (newCode: string) => {
    setCode(newCode)
    if (newCode && !codeContainsOnlyAlphanumericChars(newCode)) {
      setErrorMessage(t("export.error.invalid_format"))
    } else {
      setErrorMessage("")
    }
  }

  const handleOnToggleFocus = () => {
    setIsFocused(!isFocused)
  }

  const handleOnPressSecondaryButton = () => {
    navigation.navigate(EscrowVerificationRoutes.EscrowVerificationMoreInfo)
  }

  const handleOnPressSubmit = async () => {
    setIsLoading(true)
    setErrorMessage(defaultErrorMessage)
    trackEvent("product_analytics", "verification_code_submitted")
    try {
      const response = await API.submitDiagnosisKeys(code, testDate)

      if (response.kind === "success") {
        showMessage({
          message: t("common.success"),
          ...successFlashMessageOptions,
        })
        navigation.navigate(EscrowVerificationRoutes.EscrowVerificationComplete)
      } else {
        showError(response.error)
      }
      setIsLoading(false)
    } catch (e) {
      Logger.error("Unhandled error on submit code to escrow")
      Alert.alert(t("common.something_went_wrong"), e.message)
      setIsLoading(false)
    }
  }

  const showError = (error: API.SubmitKeysError): void => {
    switch (error) {
      case "Unknown":
        Alert.alert(
          t("verification_code_alerts.unknown_title"),
          t("verification_code_alerts.unknown_body"),
          [{ text: t("common.okay") }],
        )
    }
  }

  const codeLengthMin = 6
  const codeLengthMax = 16
  const codeContainsOnlyAlphanumericChars = (code: string) => {
    const alphanumericRegex = /^[a-zA-Z0-9]*$/
    return Boolean(code.match(alphanumericRegex))
  }

  const codeIsValid = (code: string): boolean => {
    return (
      code.length >= codeLengthMin &&
      code.length <= codeLengthMax &&
      codeContainsOnlyAlphanumericChars(code)
    )
  }

  const isDisabled = !codeIsValid(code)

  const codeInputFocusedStyle = isFocused && { ...style.codeInputFocused }
  const codeInputStyle = { ...style.codeInput, ...codeInputFocusedStyle }

  const errorMessageShouldBeAccessible = errorMessage !== ""

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={style.contentContainer}
      testID={"affected-user-code-input-form"}
      alwaysBounceVertical={false}
    >
      <View style={style.headerContainer}>
        <Text style={style.header}>{t("export.enter_verification_code")}</Text>
      </View>
      <TextInput
        testID="code-input"
        value={code}
        placeholder={t("export.code").toUpperCase()}
        placeholderTextColor={Colors.text.placeholder}
        maxLength={codeLengthMax}
        style={codeInputStyle}
        returnKeyType="done"
        onChangeText={handleOnChangeText}
        onFocus={handleOnToggleFocus}
        onBlur={handleOnToggleFocus}
        onSubmitEditing={Keyboard.dismiss}
        blurOnSubmit={false}
      />
      <View
        accessibilityElementsHidden={!errorMessageShouldBeAccessible}
        accessible={errorMessageShouldBeAccessible}
      >
        <Text style={style.errorSubtitle}>{errorMessage}</Text>
      </View>
      <TouchableOpacity
        style={isDisabled ? style.buttonDisabled : style.button}
        onPress={handleOnPressSubmit}
        accessibilityLabel={t("common.next")}
        disabled={isDisabled}
      >
        <Text style={isDisabled ? style.buttonDisabledText : style.buttonText}>
          {t("common.next")}
        </Text>
        <SvgXml
          xml={Icons.Arrow}
          fill={isDisabled ? Colors.text.primary : Colors.neutral.white}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={style.secondaryButton}
        onPress={handleOnPressSecondaryButton}
        accessibilityLabel={t("common.start")}
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
      {isLoading && <LoadingIndicator />}
    </KeyboardAwareScrollView>
  )
}

const style = StyleSheet.create({
  contentContainer: {
    minHeight: "100%",
    backgroundColor: Colors.background.primaryLight,
    paddingTop: Spacing.large,
    paddingBottom: Spacing.xxxHuge,
    paddingHorizontal: Spacing.medium,
    justifyContent: "center",
  },
  headerContainer: {
    marginBottom: Spacing.medium,
  },
  header: {
    ...Typography.header.x60,
  },
  errorSubtitle: {
    ...Typography.utility.error,
    color: Colors.text.error,
    marginTop: Spacing.xxSmall,
    marginBottom: Spacing.small,
    minHeight: Spacing.xxxHuge,
  },
  codeInput: {
    ...Forms.textInput,
    ...Typography.style.medium,
    fontSize: Typography.size.x60,
    textAlignVertical: "center",
    textAlign: "center",
    letterSpacing: 3,
    paddingTop: Spacing.small + 2,
  },
  codeInputFocused: {
    borderColor: Colors.primary.shade125,
  },
  button: {
    ...Buttons.primary.base,
    marginBottom: Spacing.small,
  },
  buttonDisabled: {
    ...Buttons.primary.disabled,
    marginBottom: Spacing.small,
  },
  buttonText: {
    ...Typography.button.primary,
    marginRight: Spacing.small,
  },
  buttonDisabledText: {
    ...Typography.button.primaryDisabled,
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
})

export default VerificationCodeForm
