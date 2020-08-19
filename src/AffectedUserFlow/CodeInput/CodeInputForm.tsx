import React, { FunctionComponent, useState } from "react"
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  View,
  Button as RNButton,
  Keyboard,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useTranslation } from "react-i18next"
import { SvgXml } from "react-native-svg"
import { useTestModeContext } from "../../TestModeContext"

import { GlobalText } from "../../components/GlobalText"
import { Button } from "../../components/Button"
import { useAffectedUserContext } from "../AffectedUserContext"
import * as API from "../verificationAPI"
import { calculateHmac } from "../hmac"
import { useExposureContext } from "../../ExposureContext"
import { Screens, AffectedUserFlowScreens } from "../../navigation"

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

const defaultErrorMessage = " "

const CodeInputForm: FunctionComponent = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const strategy = useExposureContext()
  const { setExposureSubmissionCredentials } = useAffectedUserContext()
  const { testModeEnabled } = useTestModeContext()

  const [code, setCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(defaultErrorMessage)
  const [isFocused, setIsFocused] = useState(false)

  const codeLength = 8

  const handleOnChangeText = (code: string) => {
    setErrorMessage("")
    setCode(code)
  }

  const handleOnToggleFocus = () => {
    setIsFocused(!isFocused)
  }

  const handleOnPressBack = () => {
    navigation.goBack()
  }

  const handleOnPressCancel = () => {
    navigation.navigate(Screens.Home)
  }

  const handleOnPressNextScreen = () => {
    navigation.navigate(AffectedUserFlowScreens.AffectedUserPublishConsent)
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
          navigation.navigate(
            AffectedUserFlowScreens.AffectedUserPublishConsent,
          )
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

  const codeInputFocusedStyle = isFocused && { ...style.codeInputFocused }
  const codeInputStyle = { ...style.codeInput, ...codeInputFocusedStyle }

  return (
    <View style={style.container} testID={"affected-user-code-input-form"}>
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
              width={Iconography.xSmall}
              height={Iconography.xSmall}
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
              width={Iconography.xSmall}
              height={Iconography.xSmall}
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
      {testModeEnabled && (
        <RNButton
          title={t("common.go_to_next_screen")}
          onPress={handleOnPressNextScreen}
          color={Colors.danger100}
        />
      )}
    </View>
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
  container: {
    paddingHorizontal: Spacing.medium,
    paddingTop: 110,
    paddingBottom: Spacing.small,
    backgroundColor: Colors.primaryLightBackground,
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
    ...Typography.header2,
    marginBottom: Spacing.xxSmall,
  },
  subheader: {
    ...Typography.header4,
    color: Colors.neutral140,
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
    height: 70,
    fontSize: Typography.xLarge,
    textAlignVertical: "center",
    lineHeight: Typography.largeLineHeight,
    letterSpacing: 8,
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
