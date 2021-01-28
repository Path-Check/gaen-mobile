import React, { FunctionComponent, useState } from "react"
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { useTranslation } from "react-i18next"
import dayjs from "dayjs"
import DateTimePicker from "@react-native-community/datetimepicker"
import { useNavigation } from "@react-navigation/native"
import { SvgXml } from "react-native-svg"
import StaticSafeAreaInsets from "react-native-static-safe-area-insets"

import { AffectedUserFlowStackScreens, useStatusBarEffect } from "../navigation"
import { useAffectedUserContext } from "./AffectedUserContext"
import Checkbox from "../components/Checkbox"

import { Buttons, Colors, Forms, Spacing, Typography } from "../styles"
import { Icons } from "../assets"

type Posix = number

const SymptomOnsetDate: FunctionComponent = () => {
  useStatusBarEffect("dark-content", Colors.background.primaryLight)
  const { t } = useTranslation()
  const navigation = useNavigation()

  const {
    setSymptomOnsetDate: setContextSymptomOnsetDate,
  } = useAffectedUserContext()
  const [showDatePickerAndroid, setShowDatePickerAndroid] = useState(false)
  const [
    localSymptomOnsetDate,
    setLocalSymptomOnsetDate,
  ] = useState<Posix | null>(null)

  const handleOnPressHasSymptoms = () => {
    setLocalSymptomOnsetDate(Date.now())
  }

  const handleOnPressNoSymptoms = () => {
    setLocalSymptomOnsetDate(null)
  }

  const handleOnPressDateInput = () => {
    setShowDatePickerAndroid(true)
  }

  const handleOnChangeTestDate = (
    _event: Event,
    localSymptomOnsetDate: Date | undefined,
  ) => {
    setShowDatePickerAndroid(false)

    if (localSymptomOnsetDate) {
      const posix = dayjs(localSymptomOnsetDate).valueOf()
      setLocalSymptomOnsetDate(posix)
    }
  }

  const handleOnPressContinue = () => {
    setContextSymptomOnsetDate(localSymptomOnsetDate)
    navigation.navigate(AffectedUserFlowStackScreens.AffectedUserPublishConsent)
  }

  const formattedDate = localSymptomOnsetDate
    ? dayjs(localSymptomOnsetDate).format("MMMM DD, YYYY")
    : ""

  const showDatePicker = showDatePickerAndroid || Platform.OS === "ios"

  const hasSymptomsContainerStyle = localSymptomOnsetDate
    ? {}
    : { opacity: 0.5 }

  const noSymptomsContainerStyle = localSymptomOnsetDate ? { opacity: 0.5 } : {}

  return (
    <View style={style.container}>
      <View>
        <Text style={style.headerText}>
          {t("export.symptom_onset.symptoms")}
        </Text>

        <View style={style.radioButtonsContainer}>
          <Text style={style.subheaderText}>
            {t("export.symptom_onset.did_you_have_symptoms")}
          </Text>
          <View style={noSymptomsContainerStyle}>
            <Checkbox
              label={t("export.symptom_onset.no_i_didnt_have")}
              onPress={handleOnPressNoSymptoms}
              checked={Boolean(!localSymptomOnsetDate)}
            />
          </View>
          <View style={hasSymptomsContainerStyle}>
            <Checkbox
              label={t("export.symptom_onset.yes_i_did_have")}
              onPress={handleOnPressHasSymptoms}
              checked={Boolean(localSymptomOnsetDate)}
            />
          </View>
        </View>

        {localSymptomOnsetDate ? (
          <View>
            <Text style={style.subheaderText}>
              {t("export.symptom_onset.when_did_your_symptoms")}
            </Text>
            <View style={style.inputContainer}>
              {Platform.OS === "android" && (
                <Pressable
                  onPress={handleOnPressDateInput}
                  style={style.dateInput}
                >
                  <Text style={style.dateInputText}>{formattedDate}</Text>
                </Pressable>
              )}
              {showDatePicker && (
                <DatePicker
                  date={localSymptomOnsetDate}
                  handleOnChangeTestDate={handleOnChangeTestDate}
                />
              )}
            </View>
          </View>
        ) : null}
      </View>

      <TouchableOpacity
        style={style.button}
        onPress={handleOnPressContinue}
        accessibilityLabel={t("common.continue")}
      >
        <Text style={style.buttonText}>{t("common.continue")}</Text>
        <SvgXml xml={Icons.Arrow} fill={Colors.background.primaryLight} />
      </TouchableOpacity>
    </View>
  )
}

interface DatePickerProps {
  date: Posix | null
  handleOnChangeTestDate: (_event: Event, date: Date | undefined) => void
}

const DatePicker: FunctionComponent<DatePickerProps> = ({
  date,
  handleOnChangeTestDate,
}) => {
  return (
    <DateTimePicker
      mode="date"
      display={Platform.OS === "ios" ? "compact" : "calendar"}
      value={date ? dayjs(date).toDate() : dayjs().toDate()}
      minimumDate={dayjs().subtract(14, "day").toDate()}
      maximumDate={dayjs().toDate()}
      onChange={handleOnChangeTestDate}
    />
  )
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: Spacing.medium,
    paddingHorizontal: Spacing.large,
    paddingBottom: StaticSafeAreaInsets.safeAreaInsetsBottom + Spacing.small,
    backgroundColor: Colors.background.primaryLight,
  },
  headerText: {
    ...Typography.header.x60,
    marginBottom: Spacing.medium,
  },
  subheaderText: {
    ...Typography.header.x30,
    marginBottom: Spacing.small,
  },
  radioButtonsContainer: {
    marginBottom: Spacing.small,
  },
  inputContainer: {
    marginBottom: Spacing.large,
  },
  dateInput: {
    ...Forms.textInput,
  },
  dateInputText: {
    ...Typography.body.x30,
  },
  button: {
    ...Buttons.primary.base,
    marginBottom: Spacing.small,
  },
  buttonText: {
    ...Typography.button.primary,
    marginRight: Spacing.small,
  },
})

export default SymptomOnsetDate
