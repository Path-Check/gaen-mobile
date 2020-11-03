import React from "react"
import { fireEvent, render, waitFor } from "@testing-library/react-native"
import { useNavigation } from "@react-navigation/native"

import { SymptomEntry } from "./symptomHistory"
import SymptomEntryListItem from "./SymptomEntryListItem"
import { Symptom } from "./symptom"
import { SymptomHistoryStackScreens } from "../navigation"

jest.mock("@react-navigation/native")

describe("SymptomEntryListItem", () => {
  describe("when the entry is of kind NoUserInput", () => {
    it("indicates to the user that no entry has been made", () => {
      const date = Date.parse("2020-1-1")
      const entry: SymptomEntry = {
        kind: "NoUserInput",
        date,
      }
      const { getByText } = render(<SymptomEntryListItem entry={entry} />)

      expect(getByText("No entry")).toBeDefined()
    })
  })

  describe("when the entry is of kind UserInput", () => {
    describe("when the entry has no symptoms", () => {
      it("indicates to the user that they had no symptoms that day", () => {
        const date = Date.parse("2020-1-1")
        const entry: SymptomEntry = {
          id: "asdf",
          kind: "UserInput",
          date,
          symptoms: new Set<Symptom>(),
        }
        const { getByText } = render(<SymptomEntryListItem entry={entry} />)

        expect(getByText("You felt well")).toBeDefined()
      })
    })

    describe("when the entry has symptoms", () => {
      it("displays the correct symptoms", () => {
        const date = Date.parse("2020-1-1")
        const entry: SymptomEntry = {
          id: "asdf",
          kind: "UserInput",
          date,
          symptoms: new Set<Symptom>(["cough", "fever_or_chills"]),
        }
        const { getByText } = render(<SymptomEntryListItem entry={entry} />)

        expect(getByText("• Cough")).toBeDefined()
        expect(getByText("• Fever or chills")).toBeDefined()
      })
    })
  })

  describe("when the user taps the card", () => {
    it("triggers navigation to the select symptoms form with the correct date", async () => {
      const navigateSpy = jest.fn()
      ;(useNavigation as jest.Mock).mockReturnValueOnce({
        navigate: navigateSpy,
      })
      const date = Date.parse("2020-1-1")
      const symptomEntry: SymptomEntry = {
        kind: "NoUserInput",
        date,
      }

      const { getByLabelText } = render(
        <SymptomEntryListItem entry={symptomEntry} />,
      )

      const editButton = getByLabelText("Edit - Wed Jan 1, 2020")
      fireEvent.press(editButton)

      const expectedScreen = SymptomHistoryStackScreens.SelectSymptoms
      const expectedParams = { symptomEntry }
      await waitFor(() => {
        expect(navigateSpy).toHaveBeenCalledWith(expectedScreen, expectedParams)
      })
    })
  })
})
