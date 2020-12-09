import React, { useState, FunctionComponent, useRef } from "react"
import {
  Keyboard,
  TextInput,
  Alert,
  View,
  StyleSheet,
  Pressable,
  Platform,
} from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import DateTimePicker from "@react-native-community/datetimepicker"
import { useTranslation } from "react-i18next"
import { SvgXml } from "react-native-svg"
import { showMessage } from "react-native-flash-message"
import { useNavigation } from "@react-navigation/native"
import dayjs from "dayjs"

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
  Outlines,
} from "../styles"
import { Icons } from "../assets"

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

type Posix = number

const UserDetailsForm: FunctionComponent = () => {
  useStatusBarEffect("dark-content", Colors.background.primaryLight)
  const { t } = useTranslation()
  const navigation = useNavigation()
  const { successFlashMessageOptions } = Affordances.useFlashMessageOptions()

  const { testDate, setTestDate } = useEscrowVerificationContext()
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isPhoneInputFocused, setIsPhoneInputFocused] = useState(false)
  const [errorMessage, setErrorMessage] = useState(defaultErrorMessage)
  const [showDatePickerAndroid, setShowDatePickerAndroid] = useState(false)

  const handleOnChangeTestDate = (
    _event: Event,
    testDate: Date | undefined,
  ) => {
    setShowDatePickerAndroid(false)
    testDate && setTestDate(dayjs(testDate).valueOf())
  }

  const handleOnChangePhoneNumber = (phoneNumber: string) => {
    setErrorMessage("")
    setPhoneNumber(phoneNumber)
  }

  const handleOnPressShadowPhoneInput = () => {
    setIsPhoneInputFocused(true)
    phoneInputRef?.current?.focus()
  }

  const handleOnBlurHiddenPhoneInput = () => {
    setIsPhoneInputFocused(false)
  }

  const handleOnPressDateInput = () => {
    setShowDatePickerAndroid(true)
  }

  const handleOnPressSubmit = async () => {
    setErrorMessage(defaultErrorMessage)

    if (phoneNumberIsValid(phoneNumber)) {
      await submitPhoneNumber(phoneNumber)
    } else {
      setErrorMessage(t("escrow_verification.error.invalid_phone_number"))
    }
  }

  const phoneNumberIsValid = (number: string): boolean => {
    const requiredLength = 10
    return number.length === requiredLength
  }

  const submitPhoneNumber = async (phoneNumber: string): Promise<void> => {
    setIsLoading(true)
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
    } catch (e) {
      Logger.error(`escrow verification error`, e.message)
      Alert.alert(showError("Unknown"), e.message)
    }
    setIsLoading(false)
  }

  const buttonDisabled = phoneNumber.length < 1

  const showError = (error: API.PhoneNumberError): string => {
    switch (error) {
      case "Unknown":
        return t("common.something_went_wrong")
    }
  }

  const errorMessageShouldBeAccessible = errorMessage !== ""

  const phoneInputRef = useRef<TextInput>(null)

  const shadowPhoneInputStyle = isPhoneInputFocused
    ? style.focusedShadowPhoneInput
    : style.unfocusedShadowPhoneInput

  const formattedTestDate = dayjs(testDate).format("MMMM DD, YYYY")

  const showDatePicker = showDatePickerAndroid || Platform.OS === "ios"

  return (
    <KeyboardAwareScrollView
      style={style.container}
      contentContainerStyle={style.contentContainer}
      alwaysBounceVertical={false}
    >
      <View>
        <View style={style.headerContainer}>
          <Text style={style.headerText}>
            {t("escrow_verification.user_details_form.test_details")}
          </Text>
          <Text style={style.subheaderText}>
            {t("escrow_verification.user_details_form.subheader")}
          </Text>
        </View>

        <View style={style.inputContainer}>
          <Text style={style.inputLabel}>
            {t("escrow_verification.user_details_form.phone_number")}
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

        <View style={style.inputContainer}>
          <Text style={style.inputLabel}>
            {t("escrow_verification.user_details_form.test_date")}
          </Text>
          {Platform.OS === "android" && (
            <Pressable onPress={handleOnPressDateInput} style={style.dateInput}>
              <Text style={style.dateInputText}>{formattedTestDate}</Text>
            </Pressable>
          )}
          {showDatePicker && (
            <DatePicker
              testDate={testDate}
              handleOnChangeTestDate={handleOnChangeTestDate}
            />
          )}
        </View>

        <View
          accessibilityElementsHidden={!errorMessageShouldBeAccessible}
          accessible={errorMessageShouldBeAccessible}
        >
          <Text style={style.errorSubtitle}>{errorMessage}</Text>
        </View>
        <Pressable
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
        </Pressable>
      </View>

      {isLoading && <LoadingIndicator />}
    </KeyboardAwareScrollView>
  )
}

interface DatePickerProps {
  testDate: Posix
  handleOnChangeTestDate: (_event: Event, date: Date | undefined) => void
}

const DatePicker: FunctionComponent<DatePickerProps> = ({
  testDate,
  handleOnChangeTestDate,
}) => {
  return (
    <DateTimePicker
      mode="date"
      display={Platform.OS === "ios" ? "compact" : "calendar"}
      value={dayjs(testDate).toDate()}
      minimumDate={dayjs().subtract(4, "week").toDate()}
      maximumDate={dayjs().toDate()}
      onChange={handleOnChangeTestDate}
    />
  )
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primaryLight,
  },
  contentContainer: {
    flexGrow: 1,
    padding: Spacing.medium,
  },
  headerContainer: {
    marginBottom: Spacing.small,
    paddingBottom: Spacing.small,
    borderBottomWidth: Outlines.hairline,
    borderColor: Colors.neutral.shade10,
  },
  headerText: {
    ...Typography.header.x60,
    marginBottom: Spacing.xxSmall,
  },
  subheaderText: {
    ...Typography.body.x30,
  },
  errorSubtitle: {
    ...Typography.utility.error,
    height: Spacing.large,
    marginBottom: Spacing.small,
  },
  inputContainer: {
    marginBottom: Spacing.medium,
  },
  inputLabel: {
    ...Typography.form.inputLabel,
    paddingBottom: Spacing.xxSmall,
  },
  dateInput: {
    ...Forms.textInput,
  },
  dateInputText: {
    ...Typography.body.x30,
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
