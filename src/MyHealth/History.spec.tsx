import React from "react"
import { fireEvent, cleanup, render } from "@testing-library/react-native"
import { useNavigation } from "@react-navigation/native"

import { factories } from "../factories"

import History from "../MyHealth/History"
import { SymptomLogContext } from "./SymptomLogContext"
import { CheckInStatus } from "./symptoms"
import { DateTimeUtils } from "../utils"
import dayjs from "dayjs"

afterEach(cleanup)
jest.mock("@react-navigation/native")
;(useNavigation as jest.Mock).mockReturnValue({ navigate: jest.fn() })

const defaultDate = dayjs(DateTimeUtils.daysAgo(2)).startOf("day").valueOf()

describe("History", () => {
  describe("when a day is selected", () => {
    describe("before a day is manually selected", () => {
      it("displays the log for the current day", () => {
        const { queryByText } = render(
          <SymptomLogContext.Provider
            value={factories.symptomLogContext.build({
              dailyLogData: [],
            })}
          >
            <History />
          </SymptomLogContext.Provider>,
        )
        expect(queryByText("You did not check in")).not.toBeNull()
      })
    })
    describe("when a day without a checkin is selected", () => {
      it("displays the appropriate message", () => {
        const { queryByText, getByTestId } = render(
          <SymptomLogContext.Provider
            value={factories.symptomLogContext.build({
              dailyLogData: [],
            })}
          >
            <History />
          </SymptomLogContext.Provider>,
        )
        fireEvent.press(getByTestId(`calendar-day-${defaultDate}`))
        expect(queryByText("You did not check in")).not.toBeNull()
      })
    })
    describe('when a day with a "Feeling Good" checkin is selected', () => {
      it("displays the appropriate message", () => {
        const { queryByText, getByTestId } = render(
          <SymptomLogContext.Provider
            value={factories.symptomLogContext.build({
              dailyLogData: [
                {
                  date: defaultDate,
                  checkIn: {
                    status: CheckInStatus.FeelingGood,
                    date: defaultDate,
                  },
                  logEntries: [],
                },
              ],
            })}
          >
            <History />
          </SymptomLogContext.Provider>,
        )
        fireEvent.press(getByTestId(`calendar-day-${defaultDate}`))
        expect(queryByText("You were feeling well")).not.toBeNull()
      })
    })
    describe('when a day with a "Not Feeling Good" checkin is selected', () => {
      it("displays the appropriate message", () => {
        const { queryByText, getByTestId } = render(
          <SymptomLogContext.Provider
            value={factories.symptomLogContext.build({
              dailyLogData: [
                {
                  date: defaultDate,
                  checkIn: {
                    status: CheckInStatus.FeelingNotWell,
                    date: defaultDate,
                  },
                  logEntries: [],
                },
              ],
            })}
          >
            <History />
          </SymptomLogContext.Provider>,
        )
        fireEvent.press(getByTestId(`calendar-day-${defaultDate}`))
        expect(queryByText("You were not feeling well")).not.toBeNull()
      })
    })
  })
})
