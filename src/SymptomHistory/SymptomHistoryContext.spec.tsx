import React from "react"
import { Text, TouchableOpacity } from "react-native"
import { render, waitFor, fireEvent } from "@testing-library/react-native"

import {
  useSymptomHistoryContext,
  SymptomHistoryProvider,
} from "./SymptomHistoryContext"
import * as NativeModule from "./nativeModule"
import { Symptom } from "./symptom"
import { NoData, Symptoms } from "./symptomHistory"
import Logger from "../logger"

jest.mock("./nativeModule.ts")
jest.mock("./symptom.ts")
jest.mock("../logger.ts")

// symptomHistory, updateEntry, deleteAllEntries

describe("SymptomHistoryProvider", () => {
  describe("updateEntry", () => {
    describe("when updating a days entry that is currently No Data", () => {
      it("creates a new entry", async () => {
        const createEntrySpy = (NativeModule.createEntry as jest.Mock).mockResolvedValueOnce(
          {},
        )
        const mockedDate = Date.parse("2020-09-22 10:00")
        const dateSpy = jest.spyOn(Date, "now")
        dateSpy.mockReturnValue(mockedDate)

        const symptoms = new Set<Symptom>(["cough"])
        const symptomEntry: NoData = {
          kind: "NoData",
          date: mockedDate,
        }
        const date = Date.now()

        const AddCheckLogSymptoms = () => {
          const { updateEntry } = useSymptomHistoryContext()

          return (
            <TouchableOpacity
              accessibilityLabel="add-log-entry"
              onPress={() => {
                updateEntry(date, symptoms, symptomEntry)
              }}
            />
          )
        }

        const { getByLabelText } = render(
          <SymptomHistoryProvider>
            <AddCheckLogSymptoms />
          </SymptomHistoryProvider>,
        )

        fireEvent.press(getByLabelText("add-log-entry"))

        await waitFor(() => {
          expect(createEntrySpy).toHaveBeenCalledWith(date, symptoms)
        })
      })
    })

    describe("when updating a days entry that already has sympotoms", () => {
      it("updates the existing entry", async () => {
        const updateEntrySpy = NativeModule.updateEntry as jest.Mock
        updateEntrySpy.mockResolvedValueOnce({})
        const mockedDate = Date.parse("2020-09-22 10:00")
        jest.spyOn(Date, "now").mockReturnValue(mockedDate)

        const symptoms = new Set<Symptom>(["cough"])
        const testId = "asdf-asdf-asdf-asdf"
        const symptomEntry: Symptoms = {
          id: testId,
          kind: "Symptoms",
          date: mockedDate,
          symptoms,
        }

        const date = Date.now()
        const AddCheckLogSymptoms = () => {
          const { updateEntry } = useSymptomHistoryContext()

          return (
            <>
              <TouchableOpacity
                accessibilityLabel="add-log-entry"
                onPress={() => {
                  updateEntry(date, symptoms, symptomEntry)
                }}
              />
            </>
          )
        }

        const { getByLabelText } = render(
          <SymptomHistoryProvider>
            <AddCheckLogSymptoms />
          </SymptomHistoryProvider>,
        )

        fireEvent.press(getByLabelText("add-log-entry"))

        await waitFor(() => {
          expect(updateEntrySpy).toHaveBeenCalledWith(testId, date, symptoms)
        })
      })

      it("captures exceptions and return failure responses", async () => {
        const errorMessage = "error"
        ;(NativeModule.createEntry as jest.Mock).mockRejectedValueOnce(
          new Error(errorMessage),
        )
        const resultSpy = jest.fn()
        const loggerSpy = jest.spyOn(Logger, "error")
        ;(NativeModule.readEntries as jest.Mock).mockResolvedValue([])

        const AddCheckInStatus = () => {
          const { updateEntry } = useSymptomHistoryContext()

          const date = Date.now()
          const symptomEntry: NoData = { kind: "NoData", date }

          return (
            <>
              <TouchableOpacity
                accessibilityLabel="add-log-entry"
                onPress={async () => {
                  const result = await updateEntry(
                    date,
                    new Set<Symptom>(),
                    symptomEntry,
                  )
                  resultSpy(result)
                }}
              />
            </>
          )
        }

        const { getByLabelText } = render(
          <SymptomHistoryProvider>
            <AddCheckInStatus />
          </SymptomHistoryProvider>,
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
  })

  describe("when the component mounts", () => {
    it("fetchs all daily log entries", async () => {
      const logEntries = [{ date: Date.now(), symptoms: [], id: "1" }]
      ;(NativeModule.readEntries as jest.Mock).mockResolvedValueOnce(logEntries)

      render(
        <SymptomHistoryProvider>
          <SymptomHistoryConsumer />
        </SymptomHistoryProvider>,
      )

      await waitFor(() => {
        expect(NativeModule.readEntries).toHaveBeenCalled()
      })
    })

    it("deletes all the stale data on load", async () => {
      const deleteSymptomLogsOlderThanSpy = NativeModule.deleteEntriesOlderThan as jest.Mock

      render(
        <SymptomHistoryProvider>
          <SymptomHistoryConsumer />
        </SymptomHistoryProvider>,
      )

      await waitFor(() => {
        expect(deleteSymptomLogsOlderThanSpy).toHaveBeenCalledWith(14)
      })
    })
  })
})

const SymptomHistoryConsumer = () => {
  const { symptomHistory } = useSymptomHistoryContext()

  return <Text testID="symptom-logs">{JSON.stringify(symptomHistory)}</Text>
}
