import React, { useState, FunctionComponent } from "react"
import { useTranslation } from "react-i18next"
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  StyleSheet,
  Platform,
  TouchableOpacity,
  TextInput,
  View,
  Keyboard,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import { RTLEnabledText } from "../components/RTLEnabledText"
import { NativeModule } from "../gaen"
import * as API from "./debugAPI"

import {
  Spacing,
  Buttons,
  Layout,
  Forms,
  Colors,
  Outlines,
  Typography,
} from "../styles"

const defaultErrorMessage = " "

const CodeInputScreen: FunctionComponent = () => {
  const { t } = useTranslation()

  const [email, setEmail] = useState("")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(defaultErrorMessage)

  const isIOS = Platform.OS === "ios"

  const handleOnChangeEmail = (email: string) => {
    setErrorMessage("")
    setEmail(email)
  }

  const handleOnChangeDescription = (description: string) => {
    setErrorMessage("")
    setDescription(description)
  }

  const handleOnPressSubmit = async () => {
    setIsLoading(true)
    setErrorMessage(defaultErrorMessage)
    try {
      const payload = await NativeModule.fetchDebugLog()
      const response = await API.postDebugLog({ email, description, payload })

      if (response.kind === "success") {
        Alert.alert(t("common.success"))
      } else {
        setErrorMessage(showError(response.error))
      }
      setIsLoading(false)
    } catch (e) {
      Alert.alert(t("common.something_went_wrong"), e.message)
      setIsLoading(false)
    }
  }

  const showError = (error: API.SubmitLogsError): string => {
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
                <RTLEnabledText style={style.header}>
                  {t("more.debug.submit_your_debug_log")}
                </RTLEnabledText>
              </View>

              <View style={style.inputContainer}>
                <RTLEnabledText style={style.inputLabel}>
                  {t("label.email_optional")}
                </RTLEnabledText>
                <TextInput
                  value={email}
                  placeholder={"email@example.com"}
                  placeholderTextColor={Colors.placeholderTextColor}
                  style={style.textInput}
                  keyboardType={"email-address"}
                  returnKeyType={"done"}
                  onChangeText={handleOnChangeEmail}
                  blurOnSubmit={false}
                  onSubmitEditing={Keyboard.dismiss}
                  autoCapitalize={"none"}
                />
              </View>

              <View style={style.inputContainer}>
                <RTLEnabledText style={style.inputLabel}>
                  {t("label.description_optional")}
                </RTLEnabledText>
                <TextInput
                  value={description}
                  style={style.descriptionInput}
                  keyboardType={"default"}
                  returnKeyType={"done"}
                  onChangeText={handleOnChangeDescription}
                  blurOnSubmit={false}
                  onSubmitEditing={Keyboard.dismiss}
                  multiline
                />
              </View>

              <RTLEnabledText style={style.errorSubtitle}>
                {errorMessage}
              </RTLEnabledText>
            </View>
            {isLoading ? <LoadingIndicator /> : null}

            <View>
              <TouchableOpacity
                onPress={handleOnPressSubmit}
                accessible
                accessibilityLabel={t("common.submit")}
                accessibilityRole="button"
                style={style.button}
              >
                <RTLEnabledText style={style.buttonText}>
                  {t("common.submit")}
                </RTLEnabledText>
              </TouchableOpacity>
            </View>
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
    backgroundColor: Colors.primaryBackgroundFaintShade,
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
    ...Outlines.textInput,
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
    zIndex: Layout.level1,
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
  button: {
    ...Buttons.primary,
  },
  buttonText: {
    ...Typography.buttonTextPrimary,
  },
})

export default CodeInputScreen
