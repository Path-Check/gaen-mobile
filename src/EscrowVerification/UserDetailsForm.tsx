import React, { useState, FunctionComponent, useRef } from "react"
import {
  Keyboard,
  TextInput,
  Alert,
  View,
  StyleSheet,
  Pressable,
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
} from "../styles"
import { Icons } from "../assets"

const defaultErrorMessage = " "

export const phoneToFormattedString = (phonenumber: string): string => {
  const underscores = new Array(10).fill("_")
  const digits = phonenumber.split("")
  const characters = [...digits, ...underscores]

  const areaCode = characters.slice(0, 3).join("")
  const firstPart = characters.slice(3, 6).join("")
  const secondPart = characters.slice(6, 10).join("")

  return `(${areaCode}) ${firstPart}-${secondPart}`
}

const UserDetailsForm: FunctionComponent = () => {
  useStatusBarEffect("dark-content", Colors.background.primaryLight)
  const { t } = useTranslation()
  const navigation = useNavigation()
  const { successFlashMessageOptions } = Affordances.useFlashMessageOptions()

  const { testDate, setTestDate } = useEscrowVerificationContext()

  const [phoneNumber, setPhoneNumber] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [errorMessage, setErrorMessage] = useState(defaultErrorMessage)

  const handleOnChangeTestDate = (testDate: Date | undefined) => {
    testDate && setTestDate(dayjs(testDate).valueOf())
  }

  const handleOnChangePhoneNumber = (phoneNumber: string) => {
    setErrorMessage("")
    setPhoneNumber(phoneNumber)
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

  const textInputStyle = isFocused
    ? style.focusedTextInput
    : style.unfocusedTextInput

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
          <Text style={style.subheader}>
            {t("escrow_verification.user_details_form.subheader")}
          </Text>
        </View>
        <View style={style.inputContainer}>
          <Text style={style.inputLabel}>
            {t("escrow_verification.user_details_form.test_date")}
          </Text>
          <DateTimePicker
            value={dayjs(testDate).toDate()}
            minimumDate={dayjs().subtract(4, "week").toDate()}
            maximumDate={dayjs().toDate()}
            onChange={(_event: Event, date?: Date) =>
              handleOnChangeTestDate(date)
            }
          />
        </View>

        <View style={style.inputContainer}>
          <Text style={style.inputLabel}>
            {t("escrow_verification.user_details_form.phone_number")}
          </Text>
          <Pressable
            onPress={() => {
              setIsFocused(true)
              phoneInputRef?.current?.focus()
            }}
          >
            <Text style={textInputStyle}>
              {phoneToFormattedString(phoneNumber)}
            </Text>
          </Pressable>
          <TextInput
            ref={phoneInputRef}
            onBlur={() => setIsFocused(false)}
            style={{ display: "none" }}
            placeholder={"(123) 123-4567"}
            placeholderTextColor={Colors.text.placeholder}
            keyboardType="phone-pad"
            maxLength={10}
            returnKeyType="done"
            onChangeText={handleOnChangePhoneNumber}
            blurOnSubmit={false}
            onSubmitEditing={Keyboard.dismiss}
            testID="phone-number-input"
            multiline
          />
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
  subheader: {
    ...Typography.header.x20,
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
  unfocusedTextInput: {
    ...Forms.textInput,
    ...Typography.style.monospace,
  },
  focusedTextInput: {
    ...Forms.textInput,
    ...Typography.style.monospace,
    borderColor: Colors.primary.shade100,
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
