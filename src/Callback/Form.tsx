import React, { useState, FunctionComponent } from "react"
import { useTranslation } from "react-i18next"
import {
  Alert,
  KeyboardAvoidingView,
  StyleSheet,
  Platform,
  TextInput,
  View,
  ScrollView,
  Keyboard,
} from "react-native"
import { useNavigation } from "@react-navigation/native"

import { useStatusBarEffect, CallbackStackScreens } from "../navigation"
import { useConfigurationContext } from "../ConfigurationContext"
import { Button, LoadingIndicator, Text } from "../components"
import * as API from "./callbackAPI"
import Logger from "../logger"

import { Spacing, Forms, Colors, Typography } from "../styles"

const defaultErrorMessage = " "

const CallbackForm: FunctionComponent = () => {
  useStatusBarEffect("light-content", Colors.headerBackground)
  const { t } = useTranslation()
  const { healthAuthorityName } = useConfigurationContext()
  const navigation = useNavigation()

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
      Alert.alert(t("common.something_went_wrong"), e.message)
      setIsLoading(false)
    }
  }

  const buttonDisabled = phoneNumber.length === 0

  const showError = (error: string): string => {
    switch (error) {
      default: {
        return t("common.something_went_wrong")
      }
    }
  }

  return (
    <>
      <ScrollView
        style={style.container}
        contentContainerStyle={style.contentContainer}
      >
        <KeyboardAvoidingView
          keyboardVerticalOffset={Spacing.xSmall}
          behavior={isIOS ? "position" : undefined}
        >
          <View>
            <View style={style.headerContainer}>
              <Text style={style.header}>{t("callback.request_a_call")}</Text>
              <Text style={style.subheader}>
                {t("callback.fill_out_the_info", {
                  healthAuthorityName,
                })}
              </Text>
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
          <Button
            onPress={handleOnPressSubmit}
            label={t("common.submit")}
            customButtonStyle={style.button}
            disabled={buttonDisabled}
          />
        </KeyboardAvoidingView>
      </ScrollView>
      {isLoading && <LoadingIndicator />}
    </>
  )
}

const style = StyleSheet.create({
  container: {
    height: "100%",
    paddingHorizontal: Spacing.medium,
    paddingTop: Spacing.large,
    backgroundColor: Colors.primaryLightBackground,
  },
  contentContainer: {
    justifyContent: "space-between",
    paddingBottom: Spacing.xxHuge,
  },
  headerContainer: {
    marginBottom: Spacing.small,
  },
  header: {
    ...Typography.header2,
    marginBottom: Spacing.xxSmall,
  },
  subheader: {
    ...Typography.body1,
    marginBottom: Spacing.xxSmall,
  },
  errorSubtitle: {
    ...Typography.error,
    height: Spacing.huge,
  },
  inputContainer: {
    marginBottom: Spacing.medium,
  },
  inputLabel: {
    ...Typography.formInputLabel,
    paddingBottom: Spacing.xxSmall,
  },
  textInput: {
    ...Forms.textInput,
  },
  button: {
    alignSelf: "flex-start",
  },
})

export default CallbackForm
