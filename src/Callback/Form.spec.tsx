import React from "react"
import { useNavigation } from "@react-navigation/native"
import { render, fireEvent, waitFor } from "@testing-library/react-native"

import { postCallbackInfo } from "./callbackAPI"
import Form from "./Form"
import { CallbackStackScreens } from "../navigation"
import Logger from "../logger"
import { Alert } from "react-native"

jest.mock("./callbackAPI")
jest.mock("@react-navigation/native")
jest.mock("../logger.ts")
describe("Form", () => {
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

  describe("on a error for a requested call back", () => {
    it("shows an alert to the user and logs the error", async () => {
      const alertSpy = jest.spyOn(Alert, "alert")
      const loggErrorSpy = jest.spyOn(Logger, "error")
      const errorMessage = "errorMessage"
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
  })
})
