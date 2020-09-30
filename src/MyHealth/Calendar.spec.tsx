import React from "react"
import { cleanup, render } from "@testing-library/react-native"

import { toLogDataHistory } from "./logDataHistory"
import { factories } from "../factories"

import Calendar from "./Calendar"
import { DayLogData } from "./symptoms"
import dayjs from "dayjs"

afterEach(cleanup)
const buildLogDataHistory = () => {
  const logData = factories.dayLogData.build()
  const totalDays = 30
  return toLogDataHistory([logData], totalDays)
}

describe("Calendar", () => {
  const logDataHistory = buildLogDataHistory()
  const onSelectDate = (_logData: DayLogData) => {}
  const selectedDay = logDataHistory[0]

  it("displays 4 weeks of data", () => {
    const { getByText } = render(
      <Calendar
        logDataHistory={logDataHistory}
        onSelectDate={onSelectDate}
        selectedDay={selectedDay}
      />,
    )

    const dayNumber = parseInt(dayjs(logDataHistory[0].date).format("D"))

    Array(30)
      .fill(0)
      .forEach((_, i) => {
        if (Math.abs(dayNumber - i) > 3) {
          expect(getByText(`${i + 1}`)).toBeDefined()
        }
      })
  })

  it("displays the days of the week", () => {
    const labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const { getByText } = render(
      <Calendar
        logDataHistory={logDataHistory}
        onSelectDate={onSelectDate}
        selectedDay={selectedDay}
      />,
    )
    labels.forEach((label) => {
      expect(getByText(label)).toBeDefined()
    })
  })
})
