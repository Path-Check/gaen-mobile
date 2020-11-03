import React from "react"
import { Text, TouchableOpacity } from "react-native"
import { render, waitFor, fireEvent } from "@testing-library/react-native"

import {
  useSymptomHistoryContext,
  SymptomHistoryProvider,
} from "./SymptomHistoryContext"
import * as NativeModule from "./nativeModule"
import { Symptom } from "./symptom"
import { NoUserInput, UserInput } from "./symptomHistory"
import Logger from "../logger"

jest.mock("./nativeModule.ts")
jest.mock("./symptom.ts")
jest.mock("../logger.ts")

describe("SymptomHistoryProvider", () => {
  describe("updateEntry", () => {
    describe("when updating a day's entry that is currently No Data", () => {
      it("asks the native layer to create a new entry", async () => {
        const createEntrySpy = NativeModule.createEntry as jest.Mock
        createEntrySpy.mockResolvedValueOnce({})
        const date = Date.parse("2020-09-22 10:00")
        const symptoms = new Set<Symptom>(["cough"])
        const entry: NoUserInput = {
          kind: "NoUserInput",
          date,
        }

        const AddCheckLogUserInput = () => {
          const { updateEntry } = useSymptomHistoryContext()

          return (
            <TouchableOpacity
              accessibilityLabel="add-log-entry"
              onPress={() => {
                updateEntry(entry, symptoms)
              }}
            />
          )
        }

        const { getByLabelText } = render(
          <SymptomHistoryProvider>
            <AddCheckLogUserInput />
          </SymptomHistoryProvider>,
        )

        fireEvent.press(getByLabelText("add-log-entry"))

        await waitFor(() => {
          expect(createEntrySpy).toHaveBeenCalledWith(date, symptoms)
        })
      })
    })

    describe("when updating a day's entry that already has symptoms", () => {
      it("updates the existing entry", async () => {
        const updateEntrySpy = NativeModule.updateEntry as jest.Mock
        updateEntrySpy.mockResolvedValueOnce({})
        const date = Date.parse("2020-09-22 10:00")

        const symptoms = new Set<Symptom>(["cough"])
        const testId = "asdf-asdf-asdf-asdf"
        const entry: UserInput = {
          id: testId,
          kind: "UserInput",
          date,
          symptoms,
        }

        const AddCheckLogUserInput = () => {
          const { updateEntry } = useSymptomHistoryContext()

          return (
            <TouchableOpacity
              accessibilityLabel="add-log-entry"
              onPress={() => {
                updateEntry(entry, symptoms)
              }}
            />
          )
        }

        const { getByLabelText } = render(
          <SymptomHistoryProvider>
            <AddCheckLogUserInput />
          </SymptomHistoryProvider>,
        )

        fireEvent.press(getByLabelText("add-log-entry"))

        await waitFor(() => {
          expect(updateEntrySpy).toHaveBeenCalledWith(
            entry.id,
            entry.date,
            symptoms,
          )
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
          const entry: NoUserInput = { kind: "NoUserInput", date }

          return (
            <TouchableOpacity
              accessibilityLabel="add-log-entry"
              onPress={async () => {
                updateEntry(entry, new Set<Symptom>()).then(resultSpy)
              }}
            />
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
            error: "error",
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
