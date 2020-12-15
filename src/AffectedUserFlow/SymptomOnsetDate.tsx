import React, { FunctionComponent, useState } from "react"
import { Platform, Pressable, StyleSheet, Text, View } from "react-native"
import { useTranslation } from "react-i18next"
import dayjs from "dayjs"
import DateTimePicker from "@react-native-community/datetimepicker"

import { useStatusBarEffect } from "../navigation"
import Checkbox from "../components/Checkbox"

import { Colors, Forms, Outlines, Spacing, Typography } from "../styles"

type Posix = number

const SymptomOnsetDate: FunctionComponent = () => {
  useStatusBarEffect("dark-content", Colors.background.primaryLight)
  const { t } = useTranslation()

  const [hasNoSymptoms, setHasNoSymptoms] = useState<boolean>(false)
  const [date, setDate] = useState<Posix>(Date.now())
  const [showDatePickerAndroid, setShowDatePickerAndroid] = useState(false)

  const handleOnPressNoSymptoms = () => {
    setHasNoSymptoms(!hasNoSymptoms)
  }

  const handleOnPressDateInput = () => {
    setShowDatePickerAndroid(true)
  }

  const handleOnChangeTestDate = (_event: Event, date: Date | undefined) => {
    setShowDatePickerAndroid(false)
    date && setDate(dayjs(date).valueOf())
  }

  const formattedDate = dayjs(date).format("MMMM DD, YYYY")

  const showDatePicker = showDatePickerAndroid || Platform.OS === "ios"

  return (
    <View style={style.container}>
      <Text style={style.headerText}>
        {t("export.symptom_onset.when_did_your")}
      </Text>
      <View style={style.noSymptomsContainer}>
        <Checkbox
          label={t("export.symptom_onset.i_didnt_have")}
          onPress={handleOnPressNoSymptoms}
          checked={hasNoSymptoms}
        />
      </View>
      <View style={style.inputContainer}>
        <Text style={style.inputLabel}>
          {t("escrow_verification.user_details_form.test_date")}
        </Text>
        {Platform.OS === "android" && (
          <Pressable onPress={handleOnPressDateInput} style={style.dateInput}>
            <Text style={style.dateInputText}>{formattedDate}</Text>
          </Pressable>
        )}
        {showDatePicker && (
          <DatePicker
            date={date}
            handleOnChangeTestDate={handleOnChangeTestDate}
          />
        )}
      </View>
    </View>
  )
}

interface DatePickerProps {
  date: Posix
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
      value={dayjs(date).toDate()}
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
    paddingHorizontal: Spacing.large,
  },
  headerText: {
    ...Typography.header.x60,
    marginBottom: Spacing.xxLarge,
  },
  noSymptomsContainer: {
    paddingBottom: Spacing.xSmall,
    marginBottom: Spacing.xSmall,
    borderColor: Colors.neutral.shade10,
    borderBottomWidth: Outlines.hairline,
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
})

export default SymptomOnsetDate
