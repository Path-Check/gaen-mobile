import React from "react"
import { render, fireEvent } from "@testing-library/react-native"
import { useNavigation } from "@react-navigation/native"

import { AffectedUserContext } from "../AffectedUserContext"
import { TestModeProvider } from "../../TestModeContext"
import PublishConsentScreen from "./PublishConsentScreen"

jest.mock("@react-navigation/native")

describe("PublishConsentScreen", () => {
  describe("when the context contains hmacKey and certificate", () => {
    it("renders the PublishConsentForm", () => {
      const { queryByText, getByTestId } = render(
        <TestModeProvider>
          <AffectedUserContext.Provider
            value={{
              hmacKey: "hmacKey",
              certificate: "certificate",
              setExposureSubmissionCredentials: jest.fn(),
            }}
          >
            <PublishConsentScreen />
          </AffectedUserContext.Provider>
        </TestModeProvider>,
      )

      expect(queryByText("Invalid State")).toBeNull()
      expect(getByTestId("publish-consent-form")).toBeDefined()
    })
  })

  describe("when the context is missing hmacKey and certificate", () => {
    it("displays warning and prompts user to go back to home screen", () => {
      const navigateSpy = jest.fn()
      ;(useNavigation as jest.Mock).mockReturnValue({ navigate: navigateSpy })
      const { getByText } = render(
        <TestModeProvider>
          <AffectedUserContext.Provider
            value={{
              hmacKey: null,
              certificate: null,
              setExposureSubmissionCredentials: jest.fn(),
            }}
          >
            <PublishConsentScreen />
          </AffectedUserContext.Provider>
        </TestModeProvider>,
      )

      expect(getByText("Invalid State")).toBeDefined()
      fireEvent.press(getByText("Go Back"))

      expect(navigateSpy).toHaveBeenCalledWith("Home")
    })
  })
})
