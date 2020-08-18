import React, { useEffect, useState, FunctionComponent } from "react"
import { useTranslation } from "react-i18next"
import {
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  StyleSheet,
  Platform,
  TextInput,
  View,
  Keyboard,
  SafeAreaView,
} from "react-native"
import { SvgXml } from "react-native-svg"

import { useVersionInfo } from "../More/useApplicationInfo"
import { GlobalText } from "../components/GlobalText"
import { Button } from "../components/Button"
import { reportAnIssue, ReportIssueError } from "../More/zendeskAPI"
import { Icons } from "../assets"
import { useStatusBarEffect } from "../navigation"

import { Spacing, Layout, Forms, Colors, Outlines, Typography } from "../styles"

const defaultErrorMessage = ""

const ReportIssueForm: FunctionComponent = () => {
  const { t } = useTranslation()
  const { versionInfo } = useVersionInfo()
  useStatusBarEffect("light-content")

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [body, setBody] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isDisabled, setIsDisabled] = useState(true)
  const [errorMessage, setErrorMessage] = useState(defaultErrorMessage)

  const validate = () => {
    const hasEmail = email.trim().length > 0
    const hasBody = body.trim().length > 0

    if (hasEmail && hasBody) {
      setIsDisabled(false)
    } else {
      setIsDisabled(true)
    }
  }

  useEffect(validate, [email, body])

  const isIOS = Platform.OS === "ios"

  const handleOnChangeName = (name: string) => {
    setErrorMessage("")
    setName(name)
  }

  const handleOnChangeEmail = (email: string) => {
    setErrorMessage("")
    setEmail(email)
  }

  const handleOnChangeBody = (newBody: string) => {
    setErrorMessage("")
    setBody(newBody)
  }

  const clearInputs = () => {
    setBody("")
    setEmail("")
    setName("")
  }

  const handleOnPressSubmit = async () => {
    setIsLoading(true)
    setErrorMessage(defaultErrorMessage)
    try {
      const response = await reportAnIssue({
        name,
        email,
        body,
        environment: {
          os: Platform.OS,
          osVersion: `${Platform.Version}`,
          appVersion: versionInfo,
        },
      })

      if (response.kind === "success") {
        clearInputs()
        Alert.alert(t("common.success"), t("report_issue.success"))
      } else {
        setErrorMessage(showError(response.error))
      }
      setIsLoading(false)
    } catch (e) {
      Alert.alert(t("common.something_went_wrong"), e.message)
      setIsLoading(false)
    }
  }

  const showError = (error: ReportIssueError): string => {
    switch (error) {
      case "InvalidEmailError": {
        return t("report_issue.errors.invalid_email")
      }
      default: {
        return t("common.something_went_wrong")
      }
    }
  }

  const hasError = errorMessage !== ""

  return (
    <SafeAreaView>
      <KeyboardAvoidingView
        keyboardVerticalOffset={Spacing.tiny}
        behavior={isIOS ? "padding" : undefined}
      >
        <ScrollView
          style={style.container}
          contentContainerStyle={style.contentContainer}
        >
          {hasError && (
            <View style={style.errorContainer}>
              <SvgXml
                xml={Icons.AlertCircle}
                fill={Colors.primaryRed}
                accessible
                accessibilityLabel={t("common.alert")}
              />
              <GlobalText style={style.errorText}>{errorMessage}</GlobalText>
            </View>
          )}
          <View style={style.textInputsContainer}>
            <View style={style.inputContainer}>
              <GlobalText style={style.inputLabel}>
                {t("report_issue.name")}
              </GlobalText>
              <TextInput
                accessibilityLabel={t("report_issue.name")}
                value={name}
                style={style.textInput}
                keyboardType="default"
                returnKeyType="done"
                onChangeText={handleOnChangeName}
                blurOnSubmit={false}
                onSubmitEditing={Keyboard.dismiss}
                autoCapitalize={"none"}
              />
            </View>

            <View style={style.inputContainer}>
              <GlobalText style={style.inputLabel}>
                {t("report_issue.email")}
              </GlobalText>
              <TextInput
                accessibilityLabel={t("report_issue.email")}
                value={email}
                style={style.textInput}
                keyboardType="email-address"
                returnKeyType="done"
                onChangeText={handleOnChangeEmail}
                blurOnSubmit={false}
                onSubmitEditing={Keyboard.dismiss}
                autoCapitalize="none"
              />
            </View>

            <View style={style.inputContainer}>
              <GlobalText style={style.inputLabel}>
                {t("report_issue.body")}
              </GlobalText>
              <TextInput
                accessibilityLabel={t("report_issue.body")}
                value={body}
                style={style.descriptionInput}
                keyboardType={"default"}
                returnKeyType={"done"}
                onChangeText={handleOnChangeBody}
                blurOnSubmit={false}
                onSubmitEditing={Keyboard.dismiss}
                multiline
              />
            </View>
          </View>
          <Button
            onPress={handleOnPressSubmit}
            label={t("common.submit")}
            disabled={isDisabled}
            loading={isLoading}
          />
        </ScrollView>
      </KeyboardAvoidingView>
      {isLoading ? <LoadingIndicator /> : null}
    </SafeAreaView>
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

const style = StyleSheet.create({
  container: {
    height: "100%",
    paddingHorizontal: Spacing.medium,
    backgroundColor: Colors.faintGray,
  },
  contentContainer: {
    paddingBottom: Spacing.xxLarge,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.lightestGray,
    marginTop: Spacing.small,
    padding: Spacing.small,
    borderRadius: Outlines.baseBorderRadius,
    borderColor: Colors.lighterGray,
    borderWidth: Outlines.hairline,
  },
  errorText: {
    ...Typography.mainContent,
    color: Colors.primaryRed,
    marginLeft: Spacing.small,
  },
  textInputsContainer: {
    marginTop: Spacing.medium,
  },
  inputContainer: {
    marginBottom: Spacing.large,
  },
  inputLabel: {
    ...Typography.label,
    paddingBottom: Spacing.xxSmall,
  },
  textInput: {
    ...Forms.textInputFormField,
    ...Typography.secondaryTextInput,
  },
  descriptionInput: {
    ...Forms.textInputFormField,
    ...Typography.secondaryTextInput,
    minHeight: 5 * Typography.largeLineHeight,
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
    backgroundColor: Colors.transparentDarkGray,
    borderRadius: Outlines.baseBorderRadius,
  },
})

export default ReportIssueForm
