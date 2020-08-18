import React from "react"
import { render, fireEvent, waitFor } from "@testing-library/react-native"
import { Platform, Alert } from "react-native"

import ReportIssueForm from "./ReportIssueForm"
import * as API from "../More/zendeskAPI"

const mockedVersionInfo = "versionInfo"
jest.mock("../More/useApplicationInfo", () => {
  return {
    useVersionInfo: () => {
      return {
        versionInfo: mockedVersionInfo,
      }
    },
  }
})
jest.mock("@react-navigation/native")

describe("ReportIssueForm", () => {
  describe("validations", () => {
    it("only allows submit when valid email and body are present", async () => {
      const submitSpy = jest.spyOn(API, "reportAnIssue")
      const { getByLabelText } = render(<ReportIssueForm />)
      const submitButton = getByLabelText("Submit")

      const emailInput = getByLabelText("Email (required)")
      fireEvent.changeText(emailInput, "email@email.com")

      fireEvent.press(submitButton)
      expect(submitSpy).not.toHaveBeenCalled()

      const bodyInput = getByLabelText("Feedback (required)")
      fireEvent.changeText(bodyInput, "This is the body")

      fireEvent.press(submitButton)

      await waitFor(() => expect(submitSpy).toHaveBeenCalled())
    })
  })

  describe("on a sucessful request", () => {
    it("submits the form data and shows a success message", async () => {
      const os = Platform.OS
      const osVersion = `${Platform.Version}`
      Platform.OS = os
      Platform.Version = osVersion
      const name = "name"
      const email = "email@email.com"
      const body = "body"
      const submitSpy = jest.spyOn(API, "reportAnIssue")
      submitSpy.mockResolvedValueOnce({ kind: "success" })
      const alertSpy = jest.spyOn(Alert, "alert")
      const { getByLabelText, getByTestId } = render(<ReportIssueForm />)
      const submitButton = getByLabelText("Submit")

      const emailInput = getByLabelText("Email (required)")
      fireEvent.changeText(emailInput, email)
      const bodyInput = getByLabelText("Feedback (required)")
      fireEvent.changeText(bodyInput, body)
      const nameInput = getByLabelText("Full Name")
      fireEvent.changeText(nameInput, name)

      fireEvent.press(submitButton)

      expect(getByTestId("loading-indicator")).toBeDefined()
      await waitFor(() => {
        expect(submitSpy).toHaveBeenCalledWith({
          email,
          name,
          body,
          environment: {
            os,
            osVersion,
            appVersion: mockedVersionInfo,
          },
        })
        expect(alertSpy).toHaveBeenCalledWith(
          "Success",
          "We received your request. Thank you!",
        )
      })
    })
  })

  describe("on a failed request", () => {
    it("displays an error message", async () => {
      const submitSpy = jest.spyOn(API, "reportAnIssue")
      submitSpy.mockResolvedValueOnce({ kind: "failure", error: "Unknown" })
      const { getByLabelText, getByText } = render(<ReportIssueForm />)
      const submitButton = getByLabelText("Submit")

      const emailInput = getByLabelText("Email (required)")
      fireEvent.changeText(emailInput, "email@email.com")
      const bodyInput = getByLabelText("Feedback (required)")
      fireEvent.changeText(bodyInput, "body")
      const nameInput = getByLabelText("Full Name")
      fireEvent.changeText(nameInput, "name")

      fireEvent.press(submitButton)

      await waitFor(() => {
        expect(getByText("Something went wrong")).toBeDefined()
      })
    })
  })

  describe("on a request that throws an error", () => {
    it("displays an alert with an error message", async () => {
      const errorMessage = "error"
      const submitSpy = jest.spyOn(API, "reportAnIssue")
      submitSpy.mockRejectedValueOnce(new Error(errorMessage))
      const alertSpy = jest.spyOn(Alert, "alert")
      const { getByLabelText } = render(<ReportIssueForm />)
      const submitButton = getByLabelText("Submit")

      const emailInput = getByLabelText("Email (required)")
      fireEvent.changeText(emailInput, "email@email.com")
      const bodyInput = getByLabelText("Feedback (required)")
      fireEvent.changeText(bodyInput, "body")
      const nameInput = getByLabelText("Full Name")
      fireEvent.changeText(nameInput, "name")

      fireEvent.press(submitButton)

      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith(
          "Something went wrong",
          errorMessage,
        )
      })
    })
  })
})
