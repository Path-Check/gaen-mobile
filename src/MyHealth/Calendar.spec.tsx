import React from "react"
import { cleanup, render } from "@testing-library/react-native"

import { toLogDataHistory } from "./logDataHistory"
import { factories } from "../factories"

import Calendar from "./Calendar"
import { DayLogData } from "./symptoms"

afterEach(cleanup)

describe("Calendar", () => {
  it("renders", () => {
    const logDataHistory = buildLogDataHistory()
    const onSelectDate = (_logData: DayLogData) => {}
    const selectedDay = logDataHistory[0]

    const { getByTestId } = render(
      <Calendar
        logDataHistory={logDataHistory}
        onSelectDate={onSelectDate}
        selectedDay={selectedDay}
      />,
    )

    expect(getByTestId("myhealth-history-calendar")).not.toBeNull()
  })
})

const buildLogDataHistory = () => {
  const logData = factories.dayLogData.build()
  const totalDays = 30
  return toLogDataHistory([logData], totalDays)
}
