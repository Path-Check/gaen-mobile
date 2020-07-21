import React, { useState } from "react"
import { Text, TouchableOpacity, View, StyleSheet } from "react-native"
import { useTranslation } from "react-i18next"
import dayjs from "dayjs"

import { ExposureHistory } from "./exposureHistory"
import { ExposureDatum } from "../exposure"
import { RTLEnabledText } from "../components/RTLEnabledText"
import ExposureDatumIndicator from "./ExposureDatumIndicator"
import LegendModal from "./LegendModal"

import { Buttons, Colors, Spacing, Typography } from "../styles"

interface CalendarProps {
  exposureHistory: ExposureHistory
  onSelectDate: (exposureDatum: ExposureDatum) => void
  selectedDatum: ExposureDatum | null
}

type ModalState = "Open" | "Closed"

const Calendar = ({
  exposureHistory,
  onSelectDate,
  selectedDatum,
}: CalendarProps): JSX.Element => {
  const { t } = useTranslation()
  const [legendModal, setLegendModal] = useState<ModalState>("Closed")
  const lastMonth = dayjs().subtract(1, "month")
  const title = `${lastMonth.format("MMMM")} | ${dayjs().format(
    "MMMM",
  )}`.toUpperCase()

  const week1 = exposureHistory.slice(0, 7)
  const week2 = exposureHistory.slice(7, 14)
  const week3 = exposureHistory.slice(14, 21)

  interface CalendarRowProps {
    week: ExposureHistory
  }

  const CalendarRow = ({ week }: CalendarRowProps) => {
    return (
      <View style={styles.calendarRow}>
        {week.map((datum: ExposureDatum) => {
          const isSelected = datum.date === selectedDatum?.date

          return (
            <TouchableOpacity
              key={`calendar-day-${datum.date}`}
              testID={`calendar-day-${datum.date}`}
              onPress={() => onSelectDate(datum)}
            >
              <ExposureDatumIndicator
                isSelected={isSelected}
                exposureDatum={datum}
              />
            </TouchableOpacity>
          )
        })}
      </View>
    )
  }

  const DayLabels = () => {
    const labels = ["S", "M", "T", "W", "T", "F", "S"]
    return (
      <View style={styles.calendarRow}>
        {labels.map((label: string, idx: number) => {
          return (
            <View style={styles.labelStyle} key={`calendar-label-${idx}`}>
              <Text style={styles.labelTextStyle}>{label}</Text>
            </View>
          )
        })}
      </View>
    )
  }

  const handleOnPressLegend = () => {
    setLegendModal("Open")
  }

  const handleOnCloseModal = () => {
    setLegendModal("Closed")
  }

  return (
    <View testID={"exposure-history-calendar"} style={styles.container}>
      <View style={styles.header}>
        <RTLEnabledText style={styles.monthText}>{title}</RTLEnabledText>
        <TouchableOpacity
          onPress={handleOnPressLegend}
          style={styles.legendButton}
        >
          <RTLEnabledText style={styles.legendText}>
            {t("exposure_history.legend_button")}
          </RTLEnabledText>
        </TouchableOpacity>
      </View>
      <View style={styles.calendarContainer}>
        <DayLabels />
        <CalendarRow week={week1} />
        <CalendarRow week={week2} />
        <CalendarRow week={week3} />
      </View>
      <LegendModal
        status={legendModal}
        handleOnCloseModal={handleOnCloseModal}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  monthText: {
    ...Typography.label,
    ...Typography.bold,
    color: Colors.secondaryHeaderText,
  },
  legendButton: {
    ...Buttons.tinyTeritiaryRounded,
  },
  legendText: {
    ...Typography.label,
    ...Typography.bold,
    color: Colors.secondaryHeaderText,
  },
  calendarContainer: {
    flex: 1,
    paddingVertical: Spacing.small,
  },
  calendarRow: {
    flex: 1,
    paddingVertical: Spacing.xxSmall,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  labelStyle: {
    justifyContent: "center",
    alignItems: "center",
    width: Spacing.xHuge,
  },
  labelTextStyle: {
    ...Typography.label,
  },
})

export default Calendar
