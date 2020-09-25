import React, { useState, FunctionComponent } from "react"
import { useTranslation } from "react-i18next"
import {
  ActivityIndicator,
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
import { Button, GlobalText } from "../components"
import * as API from "./callbackAPI"
import Logger from "../logger"

import { Spacing, Layout, Forms, Colors, Outlines, Typography } from "../styles"

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

    const fakeExposureDate = "2020-01-01"
    try {
      const response = await API.postCallbackInfo({
        firstname,
        lastname,
        phoneNumber,
        exposureDate: fakeExposureDate,
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
            <GlobalText style={style.header}>
              {t("callback.well_get_in_touch")}
            </GlobalText>
            <GlobalText style={style.subheader}>
              {t("callback.fill_out_the_info", {
                healthAuthorityName,
              })}
            </GlobalText>
          </View>
          <View style={style.inputContainer}>
            <GlobalText style={style.inputLabel}>
              {t("callback.firstname")}
            </GlobalText>
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
            <GlobalText style={style.inputLabel}>
              {t("callback.lastname")}
            </GlobalText>
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
            <GlobalText style={style.inputLabel}>
              {t("callback.phone_number_required")}
            </GlobalText>
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
          <GlobalText style={style.errorSubtitle}>{errorMessage}</GlobalText>
        </View>
        {isLoading ? <LoadingIndicator /> : null}
        <Button
          onPress={handleOnPressSubmit}
          label={t("common.submit")}
          loading={isLoading}
          customButtonStyle={style.button}
          disabled={buttonDisabled}
        />
      </KeyboardAvoidingView>
    </ScrollView>
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
    paddingTop: Spacing.xxSmall,
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
  activityIndicatorContainer: {
    position: "absolute",
    zIndex: Layout.zLevel1,
    alignItems: "center",
    justifyContent: "center",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
  },
  activityIndicator: {
    width: 100,
    height: 100,
    backgroundColor: Colors.transparentNeutral30,
    borderRadius: Outlines.baseBorderRadius,
  },
})

export default CallbackForm
