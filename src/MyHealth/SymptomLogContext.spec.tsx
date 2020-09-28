import React from "react"
import { Text, TouchableOpacity } from "react-native"
import { render, waitFor, fireEvent } from "@testing-library/react-native"

import { useSymptomLogContext, SymptomLogProvider } from "./SymptomLogContext"
import {
  getLogEntries,
  getCheckIns,
  addCheckIn,
  createLogEntry,
} from "../gaen/nativeModule"
import {
  Symptom,
  CheckInStatus,
  combineSymptomAndCheckInLogs,
} from "./symptoms"
import Logger from "../logger"

jest.mock("../gaen/nativeModule.ts")
jest.mock("./symptoms.ts")
jest.mock("../logger.ts")
describe("SymptomLogProvider", () => {
  describe("data creation", () => {
    it("allows for the creation of a new check-in", async () => {
      const newStatus = CheckInStatus.FeelingGood
      const addCheckInSpy = addCheckIn as jest.Mock
      addCheckInSpy.mockResolvedValueOnce({})
      const mockedDate = Date.parse("2020-09-22 10:00")
      jest.spyOn(Date, "now").mockReturnValue(mockedDate)
      const newCheckIn = {
        date: mockedDate,
        status: newStatus,
      }
      ;(getCheckIns as jest.Mock).mockResolvedValue([])
      ;(getLogEntries as jest.Mock).mockResolvedValue([])

      const AddCheckInStatus = () => {
        const { todaysCheckIn, addTodaysCheckIn } = useSymptomLogContext()

        return (
          <>
            <Text>{todaysCheckIn.status}</Text>
            <TouchableOpacity
              accessibilityLabel="add-check-in"
              onPress={() => {
                addTodaysCheckIn(newStatus)
              }}
            />
          </>
        )
      }

      const { getByLabelText, getByText } = render(
        <SymptomLogProvider>
          <AddCheckInStatus />
        </SymptomLogProvider>,
      )

      expect(getByText(CheckInStatus.NotCheckedIn.toString())).toBeDefined()

      fireEvent.press(getByLabelText("add-check-in"))

      await waitFor(() => {
        expect(addCheckInSpy).toHaveBeenCalledWith({ ...newCheckIn })
        expect(getByText(newStatus.toString())).toBeDefined()
      })
    })

    it("allows for the creation of a new symptom log", async () => {
      const createLogEntrySpy = createLogEntry as jest.Mock
      createLogEntrySpy.mockResolvedValueOnce({})
      const mockedDate = Date.parse("2020-09-22 10:00")
      jest.spyOn(Date, "now").mockReturnValue(mockedDate)
      const symptoms: Symptom[] = ["cough"]
      const newLogEntry = {
        date: mockedDate,
        symptoms,
      }
      ;(getCheckIns as jest.Mock).mockResolvedValue([])
      ;(getLogEntries as jest.Mock).mockResolvedValue([])

      const AddCheckInStatus = () => {
        const { addLogEntry } = useSymptomLogContext()

        return (
          <>
            <TouchableOpacity
              accessibilityLabel="add-log-entry"
              onPress={() => {
                addLogEntry(symptoms)
              }}
            />
          </>
        )
      }

      const { getByLabelText } = render(
        <SymptomLogProvider>
          <AddCheckInStatus />
        </SymptomLogProvider>,
      )

      fireEvent.press(getByLabelText("add-log-entry"))

      await waitFor(() => {
        expect(createLogEntrySpy).toHaveBeenCalledWith({ ...newLogEntry })
      })
    })

    it("captures exceptions and return failure responses", async () => {
      const errorMessage = "error"
      ;(createLogEntry as jest.Mock).mockRejectedValueOnce(
        new Error(errorMessage),
      )
      const resultSpy = jest.fn()
      const loggerSpy = jest.spyOn(Logger, "error")
      ;(getCheckIns as jest.Mock).mockResolvedValue([])
      ;(getLogEntries as jest.Mock).mockResolvedValue([])

      const AddCheckInStatus = () => {
        const { addLogEntry } = useSymptomLogContext()

        return (
          <>
            <TouchableOpacity
              accessibilityLabel="add-log-entry"
              onPress={async () => {
                const result = await addLogEntry([])
                resultSpy(result)
              }}
            />
          </>
        )
      }

      const { getByLabelText } = render(
        <SymptomLogProvider>
          <AddCheckInStatus />
        </SymptomLogProvider>,
      )

      fireEvent.press(getByLabelText("add-log-entry"))

      await waitFor(() => {
        expect(resultSpy).toHaveBeenCalledWith({
          kind: "failure",
        })
        expect(loggerSpy).toHaveBeenCalledWith(errorMessage)
      })
    })
  })

  describe("data seeding", () => {
    it("fetch all daily check-in and log entries to serialize", async () => {
      const checkIns = [{ date: Date.now(), status: CheckInStatus.FeelingGood }]
      const logEntries = [{ date: Date.now(), symptoms: [], id: "1" }]
      ;(getCheckIns as jest.Mock).mockResolvedValueOnce(checkIns)
      ;(getLogEntries as jest.Mock).mockResolvedValueOnce(logEntries)
      const serializeSpy = combineSymptomAndCheckInLogs as jest.Mock

      render(
        <SymptomLogProvider>
          <CurrentCheckInStatus />
        </SymptomLogProvider>,
      )

      await waitFor(() => {
        expect(serializeSpy).toHaveBeenCalledWith(logEntries, checkIns)
      })
    })

    describe("when the user checked in today", () => {
      it("sets todays check in to todays entry", async () => {
        const mockedDate = Date.parse("2020-09-22 10:00")
        jest.spyOn(Date, "now").mockReturnValue(mockedDate)
        const todaysCheckIn = {
          date: mockedDate,
          status: CheckInStatus.FeelingGood,
        }
        const checkIns = [todaysCheckIn]
        ;(getCheckIns as jest.Mock).mockResolvedValueOnce(checkIns)
        ;(getLogEntries as jest.Mock).mockResolvedValueOnce([])

        const { getByText } = render(
          <SymptomLogProvider>
            <CurrentCheckInStatus />
          </SymptomLogProvider>,
        )

        await waitFor(() => {
          expect(getByText(todaysCheckIn.status.toString())).toBeDefined()
        })
      })
    })

    describe("when the user has not checked in today", () => {
      it("sets todays check in to a default not checked in", async () => {
        const mockedTodaysDate = Date.parse("2020-09-22 10:00")
        const mockedYesterdaysDate = Date.parse("2020-09-21 10:00")
        jest.spyOn(Date, "now").mockReturnValue(mockedTodaysDate)
        const yesterdaysCheckIn = {
          date: mockedYesterdaysDate,
          status: CheckInStatus.FeelingGood,
        }
        const checkIns = [yesterdaysCheckIn]
        ;(getCheckIns as jest.Mock).mockResolvedValueOnce(checkIns)
        ;(getLogEntries as jest.Mock).mockResolvedValueOnce([])

        const { getByText, queryByText } = render(
          <SymptomLogProvider>
            <CurrentCheckInStatus />
          </SymptomLogProvider>,
        )

        await waitFor(() => {
          expect(queryByText(yesterdaysCheckIn.status.toString())).toBeNull()
          expect(getByText(CheckInStatus.NotCheckedIn.toString())).toBeDefined()
        })
      })
    })
  })
})

const CurrentCheckInStatus = () => {
  const { todaysCheckIn } = useSymptomLogContext()

  return <Text>{todaysCheckIn.status}</Text>
}
