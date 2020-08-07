import React, { FunctionComponent, useState } from "react"
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  StyleSheet,
  Platform,
  TouchableOpacity,
  TextInput,
  View,
  Keyboard,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useTranslation } from "react-i18next"

import { GlobalText } from "../../components/GlobalText"
import { Button } from "../../components/Button"
import { useAffectedUserContext } from "../AffectedUserContext"
import * as API from "../verificationAPI"
import { calculateHmac } from "../hmac"
import { useExposureContext } from "../../ExposureContext"

import { Screens, Stacks } from "../../navigation"
import {
  Spacing,
  Buttons,
  Layout,
  Forms,
  Colors,
  Outlines,
  Typography,
} from "../../styles"

const defaultErrorMessage = " "

const CodeInputForm: FunctionComponent = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const strategy = useExposureContext()
  const { setExposureSubmissionCredentials } = useAffectedUserContext()

  const [code, setCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(defaultErrorMessage)

  const isIOS = Platform.OS === "ios"
  const codeLength = 8

  const handleOnChangeText = (code: string) => {
    setErrorMessage("")
    setCode(code)
  }

  const handleOnPressCancel = () => {
    navigation.navigate(Stacks.More)
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

        const certResponse = await API.postTokenAndHmac(token, hmacDigest)

        if (certResponse.kind === "success") {
          const certificate = certResponse.body.certificate
          setExposureSubmissionCredentials(certificate, hmacKey)
          Keyboard.dismiss()
          navigation.navigate(Screens.AffectedUserPublishConsent)
        } else {
          setErrorMessage(showCertificateError(certResponse.error))
        }
      } else {
        setErrorMessage(showError(response.error))
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
      case "InvalidVerificationUrl": {
        return "Invalid Verification Url"
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
      default: {
        return t("export.error.unknown_code_verification_error")
      }
    }
  }

  const isDisabled = code.length !== codeLength

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={Spacing.tiny}
      behavior={isIOS ? "padding" : undefined}
    >
      <View style={style.container} testID={"affected-user-code-input-form"}>
        <View>
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
              testID={"code-input"}
              value={code}
              placeholder={"00000000"}
              placeholderTextColor={Colors.placeholderTextColor}
              maxLength={codeLength}
              style={style.codeInput}
              keyboardType={"number-pad"}
              returnKeyType={"done"}
              onChangeText={handleOnChangeText}
              blurOnSubmit={false}
            />
          </View>

          <GlobalText style={style.errorSubtitle}>{errorMessage}</GlobalText>
        </View>
        {isLoading ? <LoadingIndicator /> : null}

        <View>
          <Button
            onPress={handleOnPressSubmit}
            label={t("common.submit")}
            disabled={isDisabled}
          />
          <TouchableOpacity
            onPress={handleOnPressCancel}
            style={style.secondaryButton}
            accessibilityLabel={t("export.code_input_button_cancel")}
          >
            <GlobalText style={style.secondaryButtonText}>
              {t("export.code_input_button_cancel")}
            </GlobalText>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}
const LoadingIndicator = () => {
  return (
    <View style={style.activityIndicatorContainer}>
      <ActivityIndicator
        size={"large"}
        color={Colors.darkGray}
        style={style.activityIndicator}
        testID={"loading-indicator"}
      />
    </View>
  )
}

const indicatorWidth = 120

const style = StyleSheet.create({
  container: {
    height: "100%",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.medium,
    paddingTop: Layout.oneTenthHeight,
    backgroundColor: Colors.primaryBackground,
    paddingBottom: Spacing.small,
  },
  headerContainer: {
    marginBottom: Spacing.xxxHuge,
  },
  header: {
    ...Typography.header2,
    marginBottom: Spacing.xxSmall,
  },
  subheader: {
    ...Typography.header4,
    color: Colors.secondaryText,
  },
  errorSubtitle: {
    ...Typography.header4,
    color: Colors.errorText,
    paddingTop: Spacing.xxSmall,
  },
  codeInput: {
    ...Forms.textInput,
  },
  activityIndicatorContainer: {
    position: "absolute",
    zIndex: Layout.zLevel1,
    left: Layout.halfWidth,
    top: Layout.halfHeight,
    marginLeft: -(indicatorWidth / 2),
    marginTop: -(indicatorWidth / 2),
  },
  activityIndicator: {
    width: indicatorWidth,
    height: indicatorWidth,
    backgroundColor: Colors.transparentDarkGray,
    borderRadius: Outlines.baseBorderRadius,
  },
  secondaryButton: {
    ...Buttons.secondary,
  },
  secondaryButtonText: {
    ...Typography.buttonSecondaryText,
  },
})

export default CodeInputForm
