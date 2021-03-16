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
import { useConfigurationContext } from "../ConfigurationContext"

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
      const hasSubmittedTwice = await hasReachedMaxSubmissions()

      if (!hasSubmittedTwice) {
        const response = await API.postCallbackInfo({
          firstname,
          lastname,
          phoneNumber,
        })

        if (response.kind === "success") {
          await setCount()
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
          setErrorMessage(showError(response.error))
        }
        setIsLoading(false)
      } else {
        const em = t("errors.maxed_submission_requests")
        Logger.addMetadata("requestCallbackError", {
          errorMessage: em,
        })
        Logger.error(
          `FailureToRequestCallback.Unknown.${
            em || "failure_handled_response"
          }`,
        )
        setErrorMessage(showError(em))
        Alert.alert(
          t("errors.something_went_wrong"),
          t("errors.maxed_submission_requests"),
        )
        setIsLoading(false)
      }
    } catch (e) {
      Logger.error(`FailureToRequestCallback.exception.${e.message}`)
      Alert.alert(t("errors.something_went_wrong"), e.message)
      setIsLoading(false)
    }
  }

  /* Wait for 15 minutes to pass before submitting another phonenumber after two have been submitted. */
  const setCount = async () => {
    const now = new Date()
    const nowStr = now.getTime().toString()
    const countStr = await AsyncStorage.getItem("Submissions")
    if (countStr) {
      const count = parseInt(countStr, 10) + 1
      const str = count.toString()
      await AsyncStorage.setItem("Submissions", str)
    } else {
      await AsyncStorage.setItem("Submissions", "1")
    }
    await AsyncStorage.setItem("LastSubmision", nowStr)
    return true
  }

  /* Check if the user has submitted two phonensumebers in the past 15 minutes. */
  const hasReachedMaxSubmissions = async () => {
    const countStr = await AsyncStorage.getItem("Submissions")
    if (countStr) {
      const count = parseInt(countStr, 10)

      // Optionally, check the time since the phoneNumber was last submitted.
      // If 15 minutes have passed, they may input the phoneNumber again.
      const lastTimestamp = await AsyncStorage.getItem("LastSubmission")
      if (lastTimestamp) {
        const parsedTimestamp = parseInt(lastTimestamp, 10)
        const fifteenMinutes = 1000 * 60 * 15
        const hasBeenFifteenMinutes =
          new Date().getTime() - parsedTimestamp < fifteenMinutes ? false : true
        if (hasBeenFifteenMinutes) {
          await AsyncStorage.setItem("Submissions", "0")
          return false
        }
      }

      return count > 1 ? true : false
    }
    return true
  }

  const buttonDisabled = phoneNumber.length < minimumPhoneDigits

  const showError = (error: string): string => {
    switch (error) {
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
