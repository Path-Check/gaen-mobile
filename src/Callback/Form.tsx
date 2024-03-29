import React, { useRef, useState, FunctionComponent } from "react"
import { useTranslation } from "react-i18next"
import {
  Alert,
  Pressable,
  Linking,
  KeyboardAvoidingView,
  StyleSheet,
  Platform,
  TextInput,
  View,
  ScrollView,
  Keyboard,
  TouchableOpacity,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import AsyncStorage from "@react-native-community/async-storage"

import { useStatusBarEffect, CallbackStackScreens } from "../navigation"
import { useCustomCopy } from "../configuration/useCustomCopy"
import { LoadingIndicator, Text } from "../components"
import * as API from "./callbackAPI"
import Logger from "../logger"
import { useConfigurationContext } from "../configuration"

import { Spacing, Forms, Colors, Typography, Buttons } from "../styles"

const defaultErrorMessage = " "

export const phoneToFormattedString = (phonenumber: string): string => {
  const underscores = new Array(10).fill("*")
  const digits = phonenumber.split("")
  const characters = [...digits, ...underscores]

  const areaCode = characters.slice(0, 3).join("")
  const firstPart = characters.slice(3, 6).join("")
  const secondPart = characters.slice(6, 10).join("")

  return `(${areaCode}) ${firstPart}-${secondPart}`
}

const CallbackForm: FunctionComponent = () => {
  useStatusBarEffect("dark-content", Colors.background.primaryLight)
  const { t } = useTranslation()
  const navigation = useNavigation()
  const { callbackFormInstruction } = useCustomCopy()
  const { minimumPhoneDigits, supportPhoneNumber } = useConfigurationContext()

  const [firstname, setFirstname] = useState("")
  const [lastname, setLastname] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isPhoneInputFocused, setIsPhoneInputFocused] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(defaultErrorMessage)

  const isIOS = Platform.OS === "ios"

  const handleOnChangeFirstname = (name: string) => {
    setErrorMessage("")
    setFirstname(name)
  }

  const handleOnChangeLastname = (name: string) => {
    setErrorMessage("")
    setLastname(name)
  }

  const handleOnChangePhoneNumber = (phoneNumber: string) => {
    setErrorMessage("")
    setPhoneNumber(phoneNumber)
  }

  const handleOnPressSubmit = async () => {
    setIsLoading(true)
    setErrorMessage(defaultErrorMessage)

    try {
      /* Check to see if the user has submitted a phone number twice in a row. */
      const cannotSubmit = await hasReachedMaxSubmissions()

      if (!cannotSubmit) {
        const response = await API.postCallbackInfo({
          firstname,
          lastname,
          phoneNumber,
        })

        if (response.kind === "success") {
          await setTimestamp()
          navigation.navigate(CallbackStackScreens.Success)
        } else {
          Logger.addMetadata("requestCallbackError", {
            errorMessage: response.message,
          })
          Logger.error(
            `FailureToRequestCallback.${response.error}.${
              response.message || "failure_handled_response"
            }`,
          )
          // We show the red error message here on a failed request to our callback api.
          setErrorMessage(showError(response.error))
        }
        setIsLoading(false)
      } else {
        // These calls need to be swapped out to something more specific.
        const errm = t("errors.maxed_submission_requests")
        Logger.addMetadata("requestCallbackTooManySubmissions", {
          errorMessage: errm,
        })
        // We show the red error message here when the maximum number of submissions has been called.
        setErrorMessage(showError(errm))
        setIsLoading(false)
        throw { message: errm, type: "MaximumSubmissions" }
      }
    } catch (e) {
      if (e.type && e.type === "MaximumSubmissions") {
        Logger.error(`FailureToRequestCallback.Unknown.errorMessage`)
        Alert.alert(t("errors.maxed_submission_header"), e.message)
      } else {
        Logger.error(`FailureToRequestCallback.exception.${e.message}`)
        Alert.alert(t("errors.something_went_wrong"), e.message)
      }
    }
  }

  const setTimestamp = async () => {
    const now = new Date().getTime().toString()
    await AsyncStorage.setItem("LastSubmission", now)
    return true
  }

  const hasReachedMaxSubmissions = async () => {
    const lastTimestamp = await AsyncStorage.getItem("LastSubmission")
    if (lastTimestamp) {
      const parsedTimestamp = parseInt(lastTimestamp, 10)
      const fiveMinutes = 1000 * 60 * 5
      const hasBeenFiveMinutes =
        new Date().getTime() - parsedTimestamp < fiveMinutes ? false : true
      return !hasBeenFiveMinutes
    }
    return false
  }

  const buttonDisabled = phoneNumber.length < minimumPhoneDigits

  /* Display some human-friendly text at the bottom of the screen telling them what's wrong. */
  const showError = (error: string): string => {
    switch (error) {
      case t("errors.maxed_submission_requests"):
        return t("errors.maxed_submission_header")
      case "AuthorizationFailed":
        return t("errors.authorization_failure")
      case "InvalidRequest":
        return t("errors.invalid_phone_number")
      default: {
        return t("errors.something_went_wrong")
      }
    }
  }

  const handleOnPressSupportNumber = () => {
    Linking.openURL(`tel:${supportPhoneNumber}`)
  }

  const handleOnPressShadowPhoneInput = () => {
    setIsPhoneInputFocused(true)
    phoneInputRef?.current?.focus()
  }

  const handleOnBlurHiddenPhoneInput = () => {
    setIsPhoneInputFocused(false)
  }
  const phoneInputRef = useRef<TextInput>(null)

  const shadowPhoneInputStyle = isPhoneInputFocused
    ? style.focusedShadowPhoneInput
    : style.unfocusedShadowPhoneInput

  return (
    <>
      <KeyboardAvoidingView
        contentContainerStyle={style.outerContentContainer}
        behavior={isIOS ? "position" : "height"}
        keyboardVerticalOffset={-100}
      >
        <ScrollView
          style={style.container}
          contentContainerStyle={style.contentContainer}
        >
          <View>
            <View style={style.headerContainer}>
              <Text style={style.header}>{t("callback.request_a_call")}</Text>
              <Text style={style.subheader}>{callbackFormInstruction}</Text>
              {Boolean(supportPhoneNumber) && (
                <View>
                  <Text style={style.supportNumberText}>
                    {t("callback.if_you_prefer")}
                  </Text>
                  <Pressable
                    onPress={handleOnPressSupportNumber}
                    style={style.supportNumberButton}
                  >
                    <Text style={style.supportNumberButtonText}>
                      {supportPhoneNumber}
                    </Text>
                  </Pressable>
                </View>
              )}
            </View>
            <View style={style.inputContainer}>
              <Text style={style.inputLabel}>{t("callback.firstname")}</Text>
              <TextInput
                value={firstname}
                style={style.textInput}
                keyboardType={"default"}
                returnKeyType={"done"}
                onChangeText={handleOnChangeFirstname}
                blurOnSubmit={false}
                onSubmitEditing={Keyboard.dismiss}
                autoCapitalize={"none"}
              />
            </View>
            <View style={style.inputContainer}>
              <Text style={style.inputLabel}>{t("callback.lastname")}</Text>
              <TextInput
                value={lastname}
                style={style.textInput}
                keyboardType={"default"}
                returnKeyType={"done"}
                onChangeText={handleOnChangeLastname}
                blurOnSubmit={false}
                onSubmitEditing={Keyboard.dismiss}
                autoCapitalize={"none"}
              />
            </View>
            <View style={style.inputContainer}>
              <Text style={style.inputLabel}>
                {t("callback.phone_number_required")}
              </Text>
              <Pressable onPress={handleOnPressShadowPhoneInput}>
                <Text style={shadowPhoneInputStyle}>
                  {phoneToFormattedString(phoneNumber)}
                </Text>
              </Pressable>

              <TextInput
                ref={phoneInputRef}
                onBlur={handleOnBlurHiddenPhoneInput}
                style={style.hiddenPhoneTextInput}
                keyboardType="phone-pad"
                maxLength={10}
                returnKeyType="done"
                onChangeText={handleOnChangePhoneNumber}
                blurOnSubmit={false}
                onSubmitEditing={Keyboard.dismiss}
                testID="phone-number-input"
              />
            </View>
            <Text style={style.errorSubtitle}>{errorMessage}</Text>
          </View>
          <TouchableOpacity
            onPress={handleOnPressSubmit}
            disabled={buttonDisabled}
            style={buttonDisabled ? style.buttonDisabled : style.button}
            accessibilityLabel={t("common.submit")}
          >
            <Text
              style={
                buttonDisabled ? style.buttonDisabledText : style.buttonText
              }
            >
              {t("common.submit")}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
      {isLoading && <LoadingIndicator />}
    </>
  )
}

const style = StyleSheet.create({
  outerContentContainer: {
    minHeight: "100%",
  },
  container: {
    height: "100%",
    paddingHorizontal: Spacing.medium,
    paddingTop: Spacing.large,
    backgroundColor: Colors.background.primaryLight,
  },
  contentContainer: {
    justifyContent: "space-between",
    paddingBottom: Spacing.xxHuge,
  },
  headerContainer: {
    marginBottom: Spacing.small,
  },
  header: {
    ...Typography.header.x50,
    marginBottom: Spacing.xxSmall,
  },
  subheader: {
    ...Typography.body.x30,
    marginBottom: Spacing.xxSmall,
  },
  supportNumberText: {
    ...Typography.body.x30,
  },
  supportNumberButton: {
    marginBottom: Spacing.small,
  },
  supportNumberButtonText: {
    ...Typography.button.anchorLink,
  },
  errorSubtitle: {
    ...Typography.utility.error,
    height: Spacing.huge,
  },
  inputContainer: {
    marginBottom: Spacing.medium,
  },
  inputLabel: {
    ...Typography.form.inputLabel,
    paddingBottom: Spacing.xxSmall,
  },
  textInput: {
    ...Forms.textInput,
  },
  button: {
    ...Buttons.primary.base,
  },
  buttonDisabled: {
    ...Buttons.primary.disabled,
  },
  buttonText: {
    ...Typography.button.primary,
  },
  buttonDisabledText: {
    ...Typography.button.primaryDisabled,
  },
  unfocusedShadowPhoneInput: {
    ...Forms.textInput,
    ...Typography.style.monospace,
  },
  focusedShadowPhoneInput: {
    ...Forms.textInput,
    ...Typography.style.monospace,
    borderColor: Colors.primary.shade100,
  },
  hiddenPhoneTextInput: {
    height: 0,
    width: 0,
    opacity: 0,
    position: "absolute",
  },
})

export default CallbackForm
