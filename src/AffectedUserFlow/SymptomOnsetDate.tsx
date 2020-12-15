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

import {
  Buttons,
  Colors,
  Forms,
  Outlines,
  Spacing,
  Typography,
} from "../styles"
import { Icons } from "../assets"

type Posix = number

const SymptomOnsetDate: FunctionComponent = () => {
  useStatusBarEffect("dark-content", Colors.background.primaryLight)
  const { t } = useTranslation()
  const navigation = useNavigation()

  const { symptomOnsetDate, setSymptomOnsetDate } = useAffectedUserContext()

  const [showDatePickerAndroid, setShowDatePickerAndroid] = useState(false)

  const handleOnPressNoSymptoms = () => {
    setSymptomOnsetDate(null)
  }

  const handleOnPressDateInput = () => {
    setShowDatePickerAndroid(true)
  }

  const handleOnChangeTestDate = (
    _event: Event,
    symptomOnsetDate: Date | undefined,
  ) => {
    setShowDatePickerAndroid(false)
    symptomOnsetDate && setSymptomOnsetDate(dayjs(symptomOnsetDate).valueOf())
  }

  const handleOnPressContinue = () => {
    navigation.navigate(AffectedUserFlowStackScreens.AffectedUserPublishConsent)
  }

  const formattedDate = symptomOnsetDate
    ? dayjs(symptomOnsetDate).format("MMMM DD, YYYY")
    : t("export.symptom_onset.select_date")

  const showDatePicker = showDatePickerAndroid || Platform.OS === "ios"

  const noSymptomsContainerStyle = symptomOnsetDate
    ? { ...style.noSymptomsContainer, opacity: 0.5 }
    : style.noSymptomsContainer

  const dateInputStyle = symptomOnsetDate ? {} : { opacity: 0.5 }

  return (
    <View style={style.container}>
      <View>
        <Text style={style.headerText}>
          {t("export.symptom_onset.when_did_your")}
        </Text>

        <View style={style.inputContainer}>
          <Text style={style.inputLabel}>
            {t("export.symptom_onset.symptom_onset_date")}
          </Text>
          <View style={dateInputStyle}>
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
                date={symptomOnsetDate}
                handleOnChangeTestDate={handleOnChangeTestDate}
              />
            )}
          </View>
        </View>

        <View style={noSymptomsContainerStyle}>
          <Checkbox
            label={t("export.symptom_onset.i_didnt_have")}
            onPress={handleOnPressNoSymptoms}
            checked={Boolean(!symptomOnsetDate)}
          />
        </View>
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
      minimumDate={dayjs().subtract(4, "week").toDate()}
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
    marginBottom: Spacing.xxLarge,
  },
  inputContainer: {
    marginBottom: Spacing.large,
    paddingBottom: Spacing.large,
    borderColor: Colors.neutral.shade10,
    borderBottomWidth: Outlines.hairline,
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
  noSymptomsContainer: {
    marginBottom: Spacing.xSmall,
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
