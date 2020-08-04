import React from "react"
import { render, fireEvent, wait } from "@testing-library/react-native"
import { Platform, Alert } from "react-native"
import { useNavigation } from "@react-navigation/native"

import FeedbackForm from "./FeedbackForm"
import * as API from "./zendeskAPI"

jest.mock("@react-navigation/native")
describe("Feedback Form", () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  describe("validations", () => {
    it("only allows submit when subject and body are present", async () => {
      const submitSpy = jest.spyOn(API, "submitFeedback")
      const { getByLabelText } = render(<FeedbackForm />)
      const submitButton = getByLabelText("Submit")

      const subjectInput = getByLabelText("Subject (required)")
      fireEvent.changeText(subjectInput, "This is the subject")

      fireEvent.press(submitButton)
      expect(submitSpy).not.toHaveBeenCalled()

      const bodyInput = getByLabelText("Body (required)")
      fireEvent.changeText(bodyInput, "This is the body")

      fireEvent.press(submitButton)

      await wait(() => expect(submitSpy).toHaveBeenCalled())
    })
  })

  describe("on a sucessful request", () => {
    it("submits the form data and shows a success message", async () => {
      const goBackSpy = jest.fn()
      ;(useNavigation as jest.Mock).mockReturnValue({ goBack: goBackSpy })
      const os = Platform.OS
      const osVersion = `${Platform.Version}`
      Platform.OS = os
      Platform.Version = osVersion
      const name = "name"
      const subject = "subject"
      const body = "body"
      const submitSpy = jest.spyOn(API, "submitFeedback")
      submitSpy.mockResolvedValueOnce({ kind: "success" })
      const alertSpy = jest.spyOn(Alert, "alert")
      const { getByLabelText, getByTestId } = render(<FeedbackForm />)
      const submitButton = getByLabelText("Submit")

      const subjectInput = getByLabelText("Subject (required)")
      fireEvent.changeText(subjectInput, subject)
      const bodyInput = getByLabelText("Body (required)")
      fireEvent.changeText(bodyInput, body)
      const nameInput = getByLabelText("Full Name")
      fireEvent.changeText(nameInput, name)

      fireEvent.press(submitButton)

      expect(getByTestId("loading-indicator")).toBeDefined()
      await wait(() => {
        expect(submitSpy).toHaveBeenCalledWith({
          subject,
          name,
          body,
          environment: {
            os,
            osVersion,
            appVersion: "0.0.1",
          },
        })
        expect(alertSpy).toHaveBeenCalledWith(
          "Success",
          "We received your feedback. Thank you!",
          [{ onPress: goBackSpy }],
        )
      })
    })
  })

  describe("on a failed request", () => {
    it("displays an error message", async () => {
      const submitSpy = jest.spyOn(API, "submitFeedback")
      submitSpy.mockResolvedValueOnce({ kind: "failure", error: "Unknown" })
      const { getByLabelText, getByText } = render(<FeedbackForm />)
      const submitButton = getByLabelText("Submit")

      const subjectInput = getByLabelText("Subject (required)")
      fireEvent.changeText(subjectInput, "subject")
      const bodyInput = getByLabelText("Body (required)")
      fireEvent.changeText(bodyInput, "body")
      const nameInput = getByLabelText("Full Name")
      fireEvent.changeText(nameInput, "name")

      fireEvent.press(submitButton)

      await wait(() => {
        expect(getByText("Something went wrong")).toBeDefined()
      })
    })
  })

  describe("on a request that throws an error", () => {
    it("displays an alert with an error message", async () => {
      const errorMessage = "error"
      const submitSpy = jest.spyOn(API, "submitFeedback")
      submitSpy.mockRejectedValueOnce(new Error(errorMessage))
      const alertSpy = jest.spyOn(Alert, "alert")
      const { getByLabelText } = render(<FeedbackForm />)
      const submitButton = getByLabelText("Submit")

      const subjectInput = getByLabelText("Subject (required)")
      fireEvent.changeText(subjectInput, "subject")
      const bodyInput = getByLabelText("Body (required)")
      fireEvent.changeText(bodyInput, "body")
      const nameInput = getByLabelText("Full Name")
      fireEvent.changeText(nameInput, "name")

      fireEvent.press(submitButton)

      await wait(() => {
        expect(alertSpy).toHaveBeenCalledWith(
          "Something went wrong",
          errorMessage,
        )
      })
    })
  })
})
