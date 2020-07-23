import DateTimePicker from "@react-native-community/datetimepicker"
import React, {
  Fragment,
  useEffect,
  useMemo,
  useState,
  FunctionComponent,
} from "react"

import Option from "./Option"
import { isPlatformAndroid, isPlatformiOS } from "../utils/index"
import {
  SCREEN_TYPE_CHECKBOX,
  SCREEN_TYPE_DATE,
  SCREEN_TYPE_RADIO,
} from "./constants"

type SelfAssessmentAnswer = {
  index: number
  value: string
}

type SelfAssessmentOption = {
  description?: string
  label: string
  value: string
}

interface AssessmentOptionProps {
  answer: SelfAssessmentAnswer
  index: number
  onSelect: (value: string) => void
  option: SelfAssessmentOption
  isSelected: boolean
  optionType: string
}

const AssessmentOption: FunctionComponent<AssessmentOptionProps> = ({
  answer,
  index,
  onSelect,
  option,
  isSelected,
  optionType,
}) => {
  // The API doesn't have a defined way to know a specific option is a date,
  // we just assume the first option is the date picker when type is SCREEN_TYPE_DATE
  const isDateOption = optionType === SCREEN_TYPE_DATE && index === 0
  const typeArray = [SCREEN_TYPE_CHECKBOX, SCREEN_TYPE_RADIO, SCREEN_TYPE_DATE]
  const isValidType = typeArray.includes(optionType)
  const [showDatePicker, setShowDatePicker] = useState(false)

  const [date, setDate] = useState(() =>
    isDateOption && isSelected && answer ? new Date(answer.value) : null,
  )
  const label = useMemo(() => {
    if (isDateOption && date) {
      return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
    }
    return option.label
  }, [date, isDateOption, option])

  useEffect(() => {
    if (isDateOption && !isSelected) {
      setDate(null)
      setShowDatePicker(false)
    }
  }, [isDateOption, isSelected])

  const handleOnPress = () => {
    if (isDateOption) {
      const date = new Date()
      setDate(date)
      setShowDatePicker(true)
      if (isPlatformiOS()) onSelect(date.toDateString())
      return
    }
    onSelect(option.value)
  }

  const handleDateTimePickerSelect = (_event: Event, date?: Date) => {
    if (date) {
      if (isPlatformAndroid()) setShowDatePicker(false)
      onSelect(date.toDateString())
      setDate(date)
    }
  }

  return (
    <Fragment>
      <Option
        onPress={handleOnPress}
        testID="option"
        isValidType={isValidType}
        isSelected={isSelected}
        inputType={optionType}
        title={label}
      />
      {showDatePicker && (
        <DateTimePicker
          display="default"
          is24Hour
          mode="date"
          onChange={handleDateTimePickerSelect}
          timeZoneOffsetInMinutes={0}
          testID="datepicker"
          value={date || new Date()}
        />
      )}
    </Fragment>
  )
}

export { AssessmentOption }
