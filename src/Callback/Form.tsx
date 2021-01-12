import React, { useState, FunctionComponent } from "react"
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

import { useStatusBarEffect, CallbackStackScreens } from "../navigation"
import { useCustomCopy } from "../configuration/useCustomCopy"
import { LoadingIndicator, Text } from "../components"
import * as API from "./callbackAPI"
import Logger from "../logger"
import { useConfigurationContext } from "../ConfigurationContext"

import { Spacing, Forms, Colors, Typography, Buttons } from "../styles"

const defaultErrorMessage = " "

const CallbackForm: FunctionComponent = () => {
  useStatusBarEffect("dark-content", Colors.background.primaryLight)
  const { t } = useTranslation()
  const navigation = useNavigation()
  const { callbackFormInstruction } = useCustomCopy()
  const { minimumPhoneDigits, supportPhoneNumber } = useConfigurationContext()

  const [firstname, setFirstname] = useState("")
  const [lastname, setLastname] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
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
      const response = await API.postCallbackInfo({
        firstname,
        lastname,
        phoneNumber,
      })

      if (response.kind === "success") {
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
    } catch (e) {
      Logger.error(`FailureToRequestCallback.exception.${e.message}`)
      Alert.alert(t("errors.something_went_wrong"), e.message)
      setIsLoading(false)
    }
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
                <View style={style.supportNumberContainer}>
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
              <TextInput
                value={phoneNumber}
                style={style.textInput}
                keyboardType="phone-pad"
                returnKeyType="done"
                onChangeText={handleOnChangePhoneNumber}
                blurOnSubmit={false}
                onSubmitEditing={Keyboard.dismiss}
                testID="phone-number-input"
                multiline
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
  supportNumberContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  supportNumberText: {
    ...Typography.body.x30,
  },
  supportNumberButton: {
    paddingHorizontal: Spacing.xxSmall,
    paddingVertical: Spacing.xSmall,
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
})

export default CallbackForm
