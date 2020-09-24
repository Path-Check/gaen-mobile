import React from "react"
import { render, fireEvent } from "@testing-library/react-native"
import { useNavigation } from "@react-navigation/native"

import { MyHealthStackScreens } from "../navigation"

import Today from "./Today"
import { SymptomLogContext } from "./SymptomLogContext"
import { factories } from "../factories"
import { CheckInStatus } from "./symptoms"

jest.mock("@react-navigation/native")

describe("Today", () => {
  describe("when the user has checked in today", () => {
    describe("indicated they were feeling good", () => {
      it("shows a glad to hear it message", () => {
        const { getByText } = render(
          <SymptomLogContext.Provider
            value={factories.symptomLogContext.build({
              todaysCheckIn: {
                date: Date.now(),
                status: CheckInStatus.FeelingGood,
              },
            })}
          >
            <Today />
          </SymptomLogContext.Provider>,
        )

        expect(getByText("Glad to hear it!")).toBeDefined()
      })
    })

    describe("indicated they were not feeling good", () => {
      it("shows the not feeling well message", () => {
        const { getByText } = render(
          <SymptomLogContext.Provider
            value={factories.symptomLogContext.build({
              todaysCheckIn: {
                date: Date.now(),
                status: CheckInStatus.FeelingNotWell,
              },
            })}
          >
            <Today />
          </SymptomLogContext.Provider>,
        )

        expect(
          getByText("Sorry to hear you're not feeling well!"),
        ).toBeDefined()
      })
    })
  })

  describe("when the user has not checked in today", () => {
    it("prompts the user to check-in", () => {
      const { getByLabelText, getByText } = render(
        <SymptomLogContext.Provider
          value={factories.symptomLogContext.build({
            todaysCheckIn: {
              date: Date.now(),
              status: CheckInStatus.NotCheckedIn,
            },
          })}
        >
          <Today />
        </SymptomLogContext.Provider>,
      )
      expect(getByLabelText("Good")).toBeDefined()
      expect(getByLabelText("Not well")).toBeDefined()
      expect(getByText("How are you feeling today?")).toBeDefined()
    })

    describe("when the user selects that they are feeling well", () => {
      it("saves today check-in with the feeling well status", () => {
        const addTodaysCheckInSpy = jest.fn()

        const { getByLabelText } = render(
          <SymptomLogContext.Provider
            value={factories.symptomLogContext.build({
              addTodaysCheckIn: addTodaysCheckInSpy,
            })}
          >
            <Today />
          </SymptomLogContext.Provider>,
        )

        fireEvent.press(getByLabelText("Good"))

        expect(addTodaysCheckInSpy).toHaveBeenCalledWith(
          CheckInStatus.FeelingGood,
        )
      })
    })

    describe("when the user selects that they are not feeling well", () => {
      it("saves today check-in with the feeling not well status", () => {
        const navigateSpy = jest.fn()
        ;(useNavigation as jest.Mock).mockReturnValue({
          navigate: navigateSpy,
        })
        const addTodaysCheckInSpy = jest.fn()

        const { getByLabelText } = render(
          <SymptomLogContext.Provider
            value={factories.symptomLogContext.build({
              addTodaysCheckIn: addTodaysCheckInSpy,
            })}
          >
            <Today />
          </SymptomLogContext.Provider>,
        )

        fireEvent.press(getByLabelText("Not well"))
        expect(navigateSpy).toHaveBeenCalledWith(
          MyHealthStackScreens.SelectSymptoms,
        )
        expect(addTodaysCheckInSpy).toHaveBeenCalledWith(
          CheckInStatus.FeelingNotWell,
        )
      })
    })

    it("allows the user to add a symptom log entry", () => {
      const navigateSpy = jest.fn()
      ;(useNavigation as jest.Mock).mockReturnValue({
        navigate: navigateSpy,
      })

      const { getByLabelText } = render(
        <SymptomLogContext.Provider value={factories.symptomLogContext.build()}>
          <Today />
        </SymptomLogContext.Provider>,
      )

      fireEvent.press(getByLabelText("Log symptoms"))
      expect(navigateSpy).toHaveBeenCalledWith(
        MyHealthStackScreens.SelectSymptoms,
      )
    })
  })
})
