import React, { useEffect, useState, FunctionComponent } from "react"
import { useTranslation } from "react-i18next"
import {
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
import { useNavigation } from "@react-navigation/native"

import { useVersionInfo } from "./useApplicationInfo"
import { GlobalText } from "../components/GlobalText"
import { Button } from "../components/Button"
import { reportAnIssue, ReportIssueError } from "./zendeskAPI"

import { Spacing, Layout, Forms, Colors, Outlines, Typography } from "../styles"

const defaultErrorMessage = " "

const ReportIssueForm: FunctionComponent = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const { versionInfo } = useVersionInfo()

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
        Alert.alert(t("common.success"), t("report_issue.success"), [
          { onPress: navigation.goBack },
        ])
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

  return (
    <View style={style.backgroundImage}>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          keyboardVerticalOffset={Spacing.tiny}
          behavior={isIOS ? "padding" : undefined}
        >
          <View style={style.container}>
            <View>
              <GlobalText style={style.errorSubtitle}>
                {errorMessage}
              </GlobalText>
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
            {isLoading ? <LoadingIndicator /> : null}

            <Button
              onPress={handleOnPressSubmit}
              label={t("common.submit")}
              disabled={isDisabled}
              loading={isLoading}
            />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
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

const indicatorWidth = 120

const style = StyleSheet.create({
  backgroundImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    backgroundColor: Colors.faintGray,
    paddingBottom: Spacing.medium,
  },
  container: {
    height: "100%",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.medium,
    paddingTop: Spacing.large,
    backgroundColor: Colors.faintGray,
  },
  errorSubtitle: {
    ...Typography.header4,
    color: Colors.errorText,
    paddingTop: Spacing.xxSmall,
  },
  inputContainer: {
    marginTop: Spacing.large,
  },
  inputLabel: {
    ...Typography.description,
    paddingBottom: Spacing.xxSmall,
  },
  textInput: {
    ...Typography.secondaryTextInput,
    ...Outlines.textInputBorder,
    padding: Spacing.xSmall,
    borderColor: Colors.formInputBorder,
  },
  descriptionInput: {
    ...Forms.textInputFormField,
    ...Typography.secondaryTextInput,
    minHeight: 5 * Typography.largeLineHeight,
  },
  activityIndicatorContainer: {
    position: "absolute",
    zIndex: Layout.zLevel1,
    left: Layout.halfWidth,
    top: Layout.halfHeight,
    marginLeft: -(indicatorWidth / 2),
    marginTop: -(indicatorWidth / 2),
  },
  activityIndicator: {
    width: indicatorWidth,
    height: indicatorWidth,
    backgroundColor: Colors.transparentDarkGray,
    borderRadius: Outlines.baseBorderRadius,
  },
})

export default ReportIssueForm
