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

import { GlobalText } from "../components/GlobalText"
import { Button } from "../components/Button"
import { submitFeedback, FeedbackError } from "./zendeskAPI"

import { Spacing, Layout, Forms, Colors, Outlines, Typography } from "../styles"

const defaultErrorMessage = " "

const FeedbackForm: FunctionComponent = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()

  const [name, setName] = useState("")
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isDisabled, setIsDisabled] = useState(true)
  const [errorMessage, setErrorMessage] = useState(defaultErrorMessage)

  const validate = () => {
    const hasSubject = subject.trim().length > 0
    const hasBody = body.trim().length > 0

    if (hasSubject && hasBody) {
      setIsDisabled(false)
    } else setIsDisabled(true)
  }

  useEffect(validate, [subject, body])

  const isIOS = Platform.OS === "ios"

  const handleOnChangeName = (name: string) => {
    setErrorMessage("")
    setName(name)
  }

  const handleOnChangeSubject = (subject: string) => {
    setErrorMessage("")
    setSubject(subject)
  }

  const handleOnChangeBody = (newBody: string) => {
    setErrorMessage("")
    setBody(newBody)
  }

  const clearInputs = () => {
    setBody("")
    setSubject("")
    setName("")
  }

  const handleOnPressSubmit = async () => {
    setIsLoading(true)
    setErrorMessage(defaultErrorMessage)
    try {
      const response = await submitFeedback({
        name,
        subject,
        body,
        environment: {
          os: Platform.OS,
          osVersion: `${Platform.Version}`,
          appVersion: "0.0.1",
        },
      })

      if (response.kind === "success") {
        Alert.alert(t("common.success"), t("submit_feedback.success"), [
          { onPress: navigation.goBack },
        ])
      } else {
        setErrorMessage(showError(response.error))
      }
      clearInputs()
      setIsLoading(false)
    } catch (e) {
      Alert.alert(t("common.something_went_wrong"), e.message)
      setIsLoading(false)
    }
  }

  const showError = (error: FeedbackError): string => {
    switch (error) {
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
              <View style={style.headerContainer}>
                <GlobalText style={style.header}>
                  {t("submit_feedback.title")}
                </GlobalText>
              </View>

              <View style={style.inputContainer}>
                <GlobalText style={style.inputLabel}>
                  {t("submit_feedback.name")}
                </GlobalText>
                <TextInput
                  accessibilityLabel={t("submit_feedback.name")}
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
                  {t("submit_feedback.subject")}
                </GlobalText>
                <TextInput
                  accessibilityLabel={t("submit_feedback.subject")}
                  value={subject}
                  style={style.textInput}
                  keyboardType="default"
                  returnKeyType="done"
                  onChangeText={handleOnChangeSubject}
                  blurOnSubmit={false}
                  onSubmitEditing={Keyboard.dismiss}
                  autoCapitalize="sentences"
                />
              </View>

              <View style={style.inputContainer}>
                <GlobalText style={style.inputLabel}>
                  {t("submit_feedback.body")}
                </GlobalText>
                <TextInput
                  accessibilityLabel={t("submit_feedback.body")}
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

              <GlobalText style={style.errorSubtitle}>
                {errorMessage}
              </GlobalText>
            </View>
            {isLoading ? <LoadingIndicator /> : null}

            <Button
              onPress={handleOnPressSubmit}
              label={t("common.submit")}
              disabled={isDisabled}
              loading={isLoading}
              invert
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
  },
  container: {
    height: "100%",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.medium,
    paddingTop: Spacing.large,
    backgroundColor: Colors.faintGray,
  },
  headerContainer: {
    marginBottom: Spacing.small,
  },
  header: {
    ...Typography.header2,
    marginBottom: Spacing.xxSmall,
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
    minHeight: 4 * Typography.largeLineHeight,
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

export default FeedbackForm
