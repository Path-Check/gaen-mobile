import React from "react"
import { useNavigation } from "@react-navigation/native"
import { render, fireEvent, waitFor } from "@testing-library/react-native"

import { postCallbackInfo } from "./callbackAPI"
import Form from "./Form"
import { CallbackStackScreens } from "../navigation"
import Logger from "../logger"
import { Alert } from "react-native"
import AsyncStorage from "@react-native-community/async-storage"

jest.mock("./callbackAPI")
jest.mock("@react-navigation/native")
jest.mock("../logger.ts")
describe("Form", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })
  describe("on a successful call back requested", () => {
    it("navigates to the success screen", async () => {
      expect.assertions(1)
      const navigateSpy = jest.fn()
      ;(useNavigation as jest.Mock).mockReturnValue({
        navigate: navigateSpy,
      })
      ;(postCallbackInfo as jest.Mock).mockResolvedValueOnce({
        kind: "success",
      })
      const { getByLabelText, getByTestId } = render(<Form />)

      fireEvent.changeText(getByTestId("phone-number-input"), "1234567890")
      fireEvent.press(getByLabelText("Submit"))
      await waitFor(() => {
        expect(navigateSpy).toHaveBeenCalledWith(CallbackStackScreens.Success)
      })
    })
  })

  describe("on a failed call back requested", () => {
    it("displays an error to the user and logs it", async () => {
      const loggMetadataSpy = jest.spyOn(Logger, "addMetadata")
      const loggErrorSpy = jest.spyOn(Logger, "error")
      const errorMessage = "errorMessage"
      const errorNature = "Unknown"
      const errorResponse = {
        kind: "failure",
        error: errorNature,
        message: errorMessage,
      }

      // We need to reset the submission timer to test a response error.
      AsyncStorage.setItem("LastSubmission", "1618250000")
      ;(postCallbackInfo as jest.Mock).mockResolvedValueOnce(errorResponse)
      const { getByText, getByLabelText, getByTestId } = render(<Form />)

      fireEvent.changeText(getByTestId("phone-number-input"), "1234567890")
      fireEvent.press(getByLabelText("Submit"))

      await waitFor(() => {
        expect(getByText("Something went wrong")).toBeDefined()
        expect(loggMetadataSpy).toHaveBeenCalledWith("requestCallbackError", {
          errorMessage,
        })
        expect(loggErrorSpy).toHaveBeenCalledWith(
          `FailureToRequestCallback.${errorNature}.${errorMessage}`,
        )
      })
    })
  })

  // This test aims to spy on our alert and logger errors on the UI.
  // Used for generic errors on the UI and CallbackAPI
  describe("on a error for a requested call back", () => {
    it("shows an alert to the user and logs the error", async () => {
      const alertSpy = jest.spyOn(Alert, "alert")
      const loggErrorSpy = jest.spyOn(Logger, "error")
      const errorMessage = "errorMessage"

      AsyncStorage.removeItem("LastSubmission")
      ;(postCallbackInfo as jest.Mock).mockRejectedValueOnce(
        new Error(errorMessage),
      )
      const { getByLabelText, getByTestId } = render(<Form />)

      fireEvent.changeText(getByTestId("phone-number-input"), "1234567890")
      fireEvent.press(getByLabelText("Submit"))

      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith(
          "Something went wrong",
          errorMessage,
        )
        expect(loggErrorSpy).toHaveBeenCalledWith(
          `FailureToRequestCallback.exception.${errorMessage}`,
        )
      })
    })

    it("shows a maximum submissions alert to the user and logs the error", async () => {
      const alertSpy = jest.spyOn(Alert, "alert")
      const loggMetadataSpy = jest.spyOn(Logger, "addMetadata")
      const errorMessage =
        "You have reached the max number of submissions, please wait 5 minutes to resubmit."

      // We need to reset the submission timer to test a response error.
      const now = new Date().getTime().toString()
      AsyncStorage.setItem("LastSubmission", now)
      const { getByLabelText, getByTestId } = render(<Form />)

      fireEvent.changeText(getByTestId("phone-number-input"), "1234567890")
      fireEvent.press(getByLabelText("Submit"))

      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith(
          "Maximum submissions reached.",
          errorMessage,
        )
        expect(loggMetadataSpy).toHaveBeenCalledWith(
          "requestCallbackTooManySubmissions",
          {
            errorMessage: errorMessage,
          },
        )
      })
    })
  })
})
