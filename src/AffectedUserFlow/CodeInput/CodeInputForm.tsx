import React, { FunctionComponent, useState } from "react"
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  View,
  Keyboard,
  ScrollView,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useTranslation } from "react-i18next"
import { SvgXml } from "react-native-svg"

import { GlobalText, Button, StatusBar } from "../../components"
import { useAffectedUserContext } from "../AffectedUserContext"
import * as API from "../verificationAPI"
import { calculateHmac } from "../hmac"
import { useExposureContext } from "../../ExposureContext"
import {
  Stacks,
  useStatusBarEffect,
  AffectedUserFlowStackScreens,
} from "../../navigation"

import { Icons } from "../../assets"
import {
  Spacing,
  Layout,
  Forms,
  Colors,
  Outlines,
  Typography,
  Iconography,
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

  const codeLength = 8
  const codeIsInvalidLength = code.length !== codeLength
  const codeContainsNonDigitChars = (code: string) => !code.match(/^\d+$/)

  const handleOnChangeText = (newCode: string) => {
    setErrorMessage("")
    if (newCode && codeContainsNonDigitChars(newCode)) {
      setErrorMessage(t("export.error.invalid_format"))
    } else {
      setCode(newCode)
    }
  }

  const handleOnToggleFocus = () => {
    setIsFocused(!isFocused)
  }

  const handleOnPressBack = () => {
    navigation.goBack()
  }

  const handleOnPressCancel = () => {
    navigation.navigate(Stacks.Home)
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

  const isDisabled = codeIsInvalidLength || codeContainsNonDigitChars(code)

  const codeInputFocusedStyle = isFocused && { ...style.codeInputFocused }
  const codeInputStyle = { ...style.codeInput, ...codeInputFocusedStyle }

  return (
    <>
      <StatusBar backgroundColor={Colors.primaryLightBackground} />
      <ScrollView
        contentContainerStyle={style.contentContainer}
        testID={"affected-user-code-input-form"}
      >
        <View style={style.backButtonContainer}>
          <TouchableOpacity
            onPress={handleOnPressBack}
            accessible
            accessibilityLabel={t("export.code_input_button_back")}
          >
            <View style={style.backButtonInnerContainer}>
              <SvgXml
                xml={Icons.ArrowLeft}
                fill={Colors.black}
                width={Iconography.xxSmall}
                height={Iconography.xxSmall}
              />
            </View>
          </TouchableOpacity>
        </View>
        <View style={style.cancelButtonContainer}>
          <TouchableOpacity
            onPress={handleOnPressCancel}
            accessible
            accessibilityLabel={t("export.code_input_button_cancel")}
          >
            <View style={style.cancelButtonInnerContainer}>
              <SvgXml
                xml={Icons.X}
                fill={Colors.black}
                width={Iconography.xxSmall}
                height={Iconography.xxSmall}
              />
            </View>
          </TouchableOpacity>
        </View>
        <View style={style.headerContainer}>
          <GlobalText style={style.header}>
            {t("export.code_input_title_bluetooth")}
          </GlobalText>

          <GlobalText style={style.subheader}>
            {t("export.code_input_body_bluetooth")}
          </GlobalText>
        </View>
        <View>
          <TextInput
            testID="code-input"
            value={code}
            placeholder="00000000"
            placeholderTextColor={Colors.placeholderText}
            maxLength={codeLength}
            style={codeInputStyle}
            keyboardType="number-pad"
            returnKeyType="done"
            onChangeText={handleOnChangeText}
            onFocus={handleOnToggleFocus}
            onBlur={handleOnToggleFocus}
            onSubmitEditing={Keyboard.dismiss}
            blurOnSubmit={false}
          />
        </View>
        <GlobalText style={style.errorSubtitle}>{errorMessage}</GlobalText>
        {isLoading ? <LoadingIndicator /> : null}
        <Button
          onPress={handleOnPressSubmit}
          label={t("common.next")}
          disabled={isDisabled}
          customButtonStyle={style.button}
          hasRightArrow
        />
      </ScrollView>
    </>
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
  contentContainer: {
    backgroundColor: Colors.primaryLightBackground,
    paddingTop: 110,
    paddingBottom: Spacing.xxxHuge,
    paddingHorizontal: Spacing.medium,
  },
  backButtonContainer: {
    position: "absolute",
    top: Layout.oneTwentiethHeight,
    left: 0,
  },
  backButtonInnerContainer: {
    padding: Spacing.medium,
  },
  cancelButtonContainer: {
    position: "absolute",
    top: Layout.oneTwentiethHeight,
    right: 0,
  },
  cancelButtonInnerContainer: {
    padding: Spacing.medium,
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
    marginTop: Spacing.xSmall,
    marginBottom: Spacing.small,
  },
  codeInput: {
    ...Forms.textInput,
    ...Typography.mediumBold,
    fontSize: Typography.xLarge,
    textAlignVertical: "center",
    textAlign: "center",
    letterSpacing: 8,
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
