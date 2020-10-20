import React, { FunctionComponent, useState } from "react"
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  TextInput,
  View,
  Keyboard,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useTranslation } from "react-i18next"

import { Text, Button } from "../../components"
import { useAffectedUserContext } from "../AffectedUserContext"
import * as API from "../verificationAPI"
import { calculateHmac } from "../hmac"
import { useExposureContext } from "../../ExposureContext"
import {
  useStatusBarEffect,
  AffectedUserFlowStackScreens,
} from "../../navigation"

import {
  Spacing,
  Layout,
  Forms,
  Colors,
  Outlines,
  Typography,
} from "../../styles"
import Logger from "../../logger"

const defaultErrorMessage = ""

const CodeInputForm: FunctionComponent = () => {
  useStatusBarEffect("dark-content", Colors.primaryLightBackground)
  const { t } = useTranslation()
  const navigation = useNavigation()
  const strategy = useExposureContext()
  const {
    setExposureSubmissionCredentials,
    setExposureKeys,
  } = useAffectedUserContext()

  const [code, setCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(defaultErrorMessage)
  const [isFocused, setIsFocused] = useState(false)

  const codeLengthMin = 6
  const codeLengthMax = 16
  const codeIsInvalidLength =
    code.length < codeLengthMin || code.length > codeLengthMax
  const codeContainsNonAlphanumericChars = (code: string) =>
    !code.match(/^[a-zA-Z0-9]*$/)

  const handleOnChangeText = (newCode: string) => {
    setCode(newCode)
    if (newCode && codeContainsNonAlphanumericChars(newCode)) {
      setErrorMessage(t("export.error.invalid_format"))
    } else {
      setErrorMessage("")
    }
  }

  const handleOnToggleFocus = () => {
    setIsFocused(!isFocused)
  }

  const handleOnPressSubmit = async () => {
    setIsLoading(true)
    setErrorMessage(defaultErrorMessage)
    try {
      const response = await API.postCode(code)

      if (response.kind === "success") {
        const token = response.body.token
        const exposureKeys = await strategy.getExposureKeys()
        const [hmacDigest, hmacKey] = await calculateHmac(exposureKeys)

        Logger.addMetadata("publishKeys", {
          hmacDigest,
        })

        const certResponse = await API.postTokenAndHmac(token, hmacDigest)

        if (certResponse.kind === "success") {
          const certificate = certResponse.body.certificate
          Logger.addMetadata("publishKeys", {
            certificate,
          })
          setExposureKeys(exposureKeys)
          setExposureSubmissionCredentials(certificate, hmacKey)
          Keyboard.dismiss()
          navigation.navigate(
            AffectedUserFlowStackScreens.AffectedUserPublishConsent,
          )
        } else {
          const errorMessage = showCertificateError(certResponse.error)
          Logger.error(
            `FailedCertificateGenerationWithValidCode${errorMessage}, ${certResponse.message}`,
          )
          setErrorMessage(errorMessage)
        }
      } else {
        const errorMessage = showError(response.error)
        if (response.message) {
          Logger.error(
            `FailedCodeValidation${errorMessage}, ${response.message}`,
          )
        }
        setErrorMessage(errorMessage)
      }
      setIsLoading(false)
    } catch (e) {
      Alert.alert(t("common.something_went_wrong"), e.message)
      setIsLoading(false)
    }
  }

  const showError = (error: API.CodeVerificationError): string => {
    switch (error) {
      case "InvalidCode": {
        return t("export.error.invalid_code")
      }
      case "VerificationCodeUsed": {
        return t("export.error.verification_code_used")
      }
      case "NetworkConnection": {
        return t("export.error.network_connection_error")
      }
      default: {
        return t("export.error.unknown_code_verification_error")
      }
    }
  }

  const showCertificateError = (error: API.TokenVerificationError): string => {
    switch (error) {
      case "TokenMetaDataMismatch": {
        return "token meta data mismatch"
      }
      case "NetworkConnection": {
        return t("export.error.network_connection_error")
      }
      default: {
        return t("export.error.unknown_code_verification_error")
      }
    }
  }

  const isDisabled =
    codeIsInvalidLength || codeContainsNonAlphanumericChars(code)

  const codeInputFocusedStyle = isFocused && { ...style.codeInputFocused }
  const codeInputStyle = { ...style.codeInput, ...codeInputFocusedStyle }

  const keyboardAvoidingViewBehavior = Platform.select({
    ios: "position" as const,
    android: "height" as const,
    default: "position" as const,
  })

  return (
    <KeyboardAvoidingView
      contentContainerStyle={style.outerContentContainer}
      behavior={keyboardAvoidingViewBehavior}
    >
      <ScrollView
        contentContainerStyle={style.contentContainer}
        testID={"affected-user-code-input-form"}
        alwaysBounceVertical={false}
      >
        <View style={style.headerContainer}>
          <Text style={style.header}>
            {t("export.code_input_title_bluetooth")}
          </Text>

          <Text style={style.subheader}>
            {t("export.code_input_body_bluetooth")}
          </Text>
        </View>
        <TextInput
          testID="code-input"
          value={code}
          placeholder={t("export.code_input_placeholder").toUpperCase()}
          placeholderTextColor={Colors.placeholderText}
          maxLength={codeLengthMax}
          style={codeInputStyle}
          returnKeyType="done"
          onChangeText={handleOnChangeText}
          onFocus={handleOnToggleFocus}
          onBlur={handleOnToggleFocus}
          onSubmitEditing={Keyboard.dismiss}
          blurOnSubmit={false}
        />
        <Text style={style.errorSubtitle}>{errorMessage}</Text>
        {isLoading ? <LoadingIndicator /> : null}
        <Button
          onPress={handleOnPressSubmit}
          label={t("common.next")}
          disabled={isDisabled}
          customButtonStyle={style.button}
          hasRightArrow
        />
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const LoadingIndicator = () => {
  return (
    <View style={style.activityIndicatorContainer}>
      <ActivityIndicator
        size={"large"}
        color={Colors.neutral100}
        style={style.activityIndicator}
        testID={"loading-indicator"}
      />
    </View>
  )
}

const indicatorWidth = 120
const style = StyleSheet.create({
  outerContentContainer: {
    minHeight: "100%",
  },
  contentContainer: {
    minHeight: "100%",
    backgroundColor: Colors.primaryLightBackground,
    paddingTop: Spacing.large,
    paddingBottom: Spacing.xxxHuge,
    paddingHorizontal: Spacing.medium,
    justifyContent: "center",
  },
  headerContainer: {
    marginBottom: Spacing.xxLarge,
  },
  header: {
    ...Typography.header1,
    marginBottom: Spacing.xxSmall,
  },
  subheader: {
    ...Typography.body1,
  },
  errorSubtitle: {
    ...Typography.error,
    color: Colors.errorText,
    marginTop: Spacing.xxSmall,
    marginBottom: Spacing.small,
    minHeight: Spacing.xxxHuge,
  },
  codeInput: {
    ...Forms.textInput,
    ...Typography.mediumBold,
    fontSize: Typography.xLarge,
    textAlignVertical: "center",
    textAlign: "center",
    letterSpacing: 4,
    paddingTop: Spacing.small + 2,
  },
  codeInputFocused: {
    borderColor: Colors.primary125,
  },
  button: {
    alignSelf: "flex-start",
  },
  activityIndicatorContainer: {
    position: "absolute",
    left: Layout.halfWidth,
    top: Layout.halfHeight,
    marginLeft: -(indicatorWidth / 2),
    marginTop: -(indicatorWidth / 2),
    zIndex: Layout.zLevel2,
  },
  activityIndicator: {
    width: indicatorWidth,
    height: indicatorWidth,
    backgroundColor: Colors.transparentNeutral30,
    borderRadius: Outlines.baseBorderRadius,
  },
})

export default CodeInputForm
