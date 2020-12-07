import React, { useState, FunctionComponent } from "react"
import {
  Keyboard,
  TextInput,
  Alert,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import DateTimePicker from "@react-native-community/datetimepicker"
import { useTranslation } from "react-i18next"
import { SvgXml } from "react-native-svg"
import { showMessage } from "react-native-flash-message"
import { useNavigation } from "@react-navigation/native"
import dayjs from "dayjs"

import { useConfigurationContext } from "../ConfigurationContext"
import { useEscrowVerificationContext } from "./EscrowVerificationContext"
import { LoadingIndicator, Text } from "../components"
import { useStatusBarEffect, EscrowVerificationRoutes } from "../navigation"
import Logger from "../logger"
import * as API from "./API"

import {
  Affordances,
  Forms,
  Colors,
  Spacing,
  Buttons,
  Typography,
} from "../styles"
import { Icons } from "../assets"

const defaultErrorMessage = " "

const UserDetailsForm: FunctionComponent = () => {
  useStatusBarEffect("dark-content", Colors.background.primaryLight)
  const { t } = useTranslation()
  const navigation = useNavigation()
  const { minimumPhoneDigits } = useConfigurationContext()
  const { successFlashMessageOptions } = Affordances.useFlashMessageOptions()

  const { testDate, setTestDate } = useEscrowVerificationContext()

  const [phoneNumber, setPhoneNumber] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(defaultErrorMessage)

  const handleOnChangeTestDate = (testDate: Date | undefined) => {
    testDate && setTestDate(dayjs(testDate).valueOf())
  }

  const handleOnChangePhoneNumber = (phoneNumber: string) => {
    setErrorMessage("")
    setPhoneNumber(phoneNumber)
  }

  const handleOnPressSubmit = async () => {
    setIsLoading(true)
    setErrorMessage(defaultErrorMessage)

    try {
      const response = await API.submitPhoneNumber(phoneNumber)

      if (response.kind === "success") {
        showMessage({
          message: t("common.success"),
          ...successFlashMessageOptions,
        })
        navigation.navigate(EscrowVerificationRoutes.EscrowVerificationCodeForm)
      } else {
        Alert.alert(showError(response.error))
      }
      setIsLoading(false)
    } catch (e) {
      Logger.error(`escrow verification error`, e.message)
      Alert.alert(showError("Unknown"), e.message)
      setIsLoading(false)
    }
  }

  const buttonDisabled = phoneNumber.length < minimumPhoneDigits

  const showError = (error: API.PhoneNumberError): string => {
    switch (error) {
      case "Unknown":
        return t("common.something_went_wrong")
    }
  }

  const errorMessageShouldBeAccessible = errorMessage !== ""

  return (
    <KeyboardAwareScrollView
      style={style.container}
      contentContainerStyle={style.contentContainer}
      alwaysBounceVertical={false}
    >
      <View>
        <View style={style.headerContainer}>
          <Text style={style.header}>
            {t("escrow_verification.user_details_form.test_details")}
          </Text>
        </View>
        <View style={style.inputContainer}>
          <Text style={style.inputLabel}>
            {t("escrow_verification.user_details_form.phone_number")}
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
        <DateTimePicker
          value={dayjs(testDate).toDate()}
          minimumDate={dayjs().subtract(4, "week").toDate()}
          maximumDate={dayjs().toDate()}
          onChange={(_event: Event, date?: Date) =>
            handleOnChangeTestDate(date)
          }
        />
        <View
          accessibilityElementsHidden={!errorMessageShouldBeAccessible}
          accessible={errorMessageShouldBeAccessible}
        >
          <Text style={style.errorSubtitle}>{errorMessage}</Text>
        </View>
        <TouchableOpacity
          style={buttonDisabled ? style.buttonDisabled : style.button}
          onPress={handleOnPressSubmit}
          accessibilityLabel={t("common.submit")}
          disabled={buttonDisabled}
        >
          <Text
            style={buttonDisabled ? style.buttonDisabledText : style.buttonText}
          >
            {t("common.submit")}
          </Text>
          <SvgXml
            xml={Icons.Arrow}
            fill={buttonDisabled ? Colors.text.primary : Colors.neutral.white}
          />
        </TouchableOpacity>
      </View>
      {isLoading && <LoadingIndicator />}
    </KeyboardAwareScrollView>
  )
}

const style = StyleSheet.create({
  container: {
    backgroundColor: Colors.background.primaryLight,
  },
  contentContainer: {
    padding: Spacing.medium,
  },
  headerContainer: {
    marginBottom: Spacing.small,
  },
  header: {
    ...Typography.header.x50,
    marginBottom: Spacing.xxSmall,
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

export default UserDetailsForm
