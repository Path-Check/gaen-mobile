import React from "react"
import { Alert } from "react-native"
import { render, fireEvent, waitFor } from "@testing-library/react-native"
import "@testing-library/jest-native/extend-expect"
import { useNavigation } from "@react-navigation/native"

import CodeInputForm from "./CodeInputForm"
import { AffectedUserProvider } from "../AffectedUserContext"
import * as API from "../verificationAPI"
import * as Hmac from "../hmac"
import { AffectedUserFlowStackScreens } from "../../navigation"
import { ExposureContext } from "../../ExposureContext"
import { factories } from "../../factories"

jest.mock("../../logger.ts")
jest.mock("@react-navigation/native")
;(useNavigation as jest.Mock).mockReturnValue({ navigate: jest.fn() })
describe("CodeInputForm", () => {
  it("initializes with an empty code form", () => {
    const { getByTestId } = render(
      <AffectedUserProvider isOnboardingComplete>
        <CodeInputForm linkCode="linkCode" />
      </AffectedUserProvider>,
    )

    expect(getByTestId("affected-user-code-input-form")).not.toBeNull()
    expect(getByTestId("code-input")).toHaveTextContent("")
  })

  describe("on a successful code verification", () => {
    it("navigates to the affected user publish consent", async () => {
      const navigateSpy = jest.fn()
      ;(useNavigation as jest.Mock).mockReturnValue({ navigate: navigateSpy })
      const verificationToken = "verificationToken"
      const successTokenResponse = {
        kind: "success" as const,
        body: {
          token: verificationToken,
          error: "",
          testDate: "testDate",
          testType: "confirmed" as const,
        },
      }
      const apiSpy = jest
        .spyOn(API, "postCode")
        .mockResolvedValue(successTokenResponse)
      const hmacDigest = "hmacDigest"
      const hmacKey = "hmacKey"
      jest
        .spyOn(Hmac, "calculateHmac")
        .mockResolvedValueOnce([hmacDigest, hmacKey])
      const certificateReponse = {
        kind: "success" as const,
        body: {
          certificate: "",
          error: "",
        },
      }
      const postTokenSpy = jest
        .spyOn(API, "postTokenAndHmac")
        .mockResolvedValueOnce(certificateReponse)

      const code = "12345678"
      const exposureContext = factories.exposureContext.build()

      const { getByTestId, getByLabelText } = render(
        <ExposureContext.Provider value={exposureContext}>
          <AffectedUserProvider isOnboardingComplete>
            <CodeInputForm linkCode="linkCode" />
          </AffectedUserProvider>
        </ExposureContext.Provider>,
      )
      fireEvent.changeText(getByTestId("code-input"), code)
      fireEvent.press(getByLabelText("Next"))

      await waitFor(() => {
        expect(apiSpy).toHaveBeenCalledWith(code)
        expect(postTokenSpy).toHaveBeenCalledWith(verificationToken, hmacDigest)
        expect(navigateSpy).toHaveBeenCalledWith(
          AffectedUserFlowStackScreens.AffectedUserPublishConsent,
        )
      })
    })
  })

  describe("on a failed code verification", () => {
    it("displays an alert", async () => {
      const navigateSpy = jest.fn()
      ;(useNavigation as jest.Mock).mockReturnValue({ navigate: navigateSpy })
      const successTokenResponse = {
        kind: "success" as const,
        body: {
          token: "verificationToken",
          error: "",
          testDate: "testDate",
          testType: "confirmed" as const,
        },
      }
      jest.spyOn(API, "postCode").mockResolvedValue(successTokenResponse)
      jest
        .spyOn(Hmac, "calculateHmac")
        .mockResolvedValueOnce(["hmacDigest", "hmacKey"])
      const failureCertificateResponse = {
        kind: "failure" as const,
        error: "TokenMetaDataMismatch" as const,
      }
      jest
        .spyOn(API, "postTokenAndHmac")
        .mockResolvedValueOnce(failureCertificateResponse)

      const { getByTestId, getByLabelText, getByText } = render(
        <ExposureContext.Provider value={factories.exposureContext.build()}>
          <AffectedUserProvider isOnboardingComplete>
            <CodeInputForm linkCode="linkCode" />
          </AffectedUserProvider>
        </ExposureContext.Provider>,
      )
      fireEvent.changeText(getByTestId("code-input"), "12345678")
      fireEvent.press(getByLabelText("Next"))

      await waitFor(() => {
        expect(navigateSpy).not.toHaveBeenCalled()
        expect(getByText("token meta data mismatch")).toBeDefined()
      })
    })
  })

  describe("validates the verification code", () => {
    it("informs of an invalid code error", async () => {
      const error = "InvalidCode" as const
      const wrongTokenResponse = {
        kind: "failure" as const,
        error,
      }
      jest.spyOn(API, "postCode").mockResolvedValueOnce(wrongTokenResponse)
      const alertSpy = jest.fn()
      Alert.alert = alertSpy

      const { getByTestId, getByLabelText } = render(
        <AffectedUserProvider isOnboardingComplete>
          <CodeInputForm linkCode="linkCode" />
        </AffectedUserProvider>,
      )
      fireEvent.changeText(getByTestId("code-input"), "12345678")
      fireEvent.press(getByLabelText("Next"))

      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith(
          "Invalid Code",
          "The verification code you submitted is invalid.\n\nThe code must be a valid verification code provided to you by your health authority.\n\nIt is also possible that your code has expired. If so, you will need to request a new code from your health authority.",
          [{ text: "Okay" }],
        )
      })
    })

    it("informs of a used verification code", async () => {
      const error = "VerificationCodeUsed" as const
      const wrongTokenResponse = {
        kind: "failure" as const,
        error,
      }
      jest.spyOn(API, "postCode").mockResolvedValueOnce(wrongTokenResponse)
      const alertSpy = jest.fn()
      Alert.alert = alertSpy

      const { getByTestId, getByLabelText } = render(
        <AffectedUserProvider isOnboardingComplete>
          <CodeInputForm linkCode="linkCode" />
        </AffectedUserProvider>,
      )
      fireEvent.changeText(getByTestId("code-input"), "12345678")
      fireEvent.press(getByLabelText("Next"))

      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith(
          "Verification Code Already Used",
          "The verification code provided has already been used.",
          [{ text: "Okay" }],
        )
      })
    })

    it("informs of an unknown error", async () => {
      const error = "Unknown" as const
      const wrongTokenResponse = {
        kind: "failure" as const,
        error,
      }
      jest.spyOn(API, "postCode").mockResolvedValueOnce(wrongTokenResponse)
      const alertSpy = jest.fn()
      Alert.alert = alertSpy

      const { getByTestId, getByLabelText } = render(
        <AffectedUserProvider isOnboardingComplete>
          <CodeInputForm linkCode="linkCode" />
        </AffectedUserProvider>,
      )
      fireEvent.changeText(getByTestId("code-input"), "12345678")
      fireEvent.press(getByLabelText("Next"))

      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith(
          "Something Went Wrong",
          "An unexpected error occurred. Please try again.",
          [{ text: "Okay" }],
        )
      })
    })

    it("informs of a formatting error", async () => {
      const { getByTestId, getByLabelText, getByText, queryByText } = render(
        <AffectedUserProvider isOnboardingComplete>
          <CodeInputForm linkCode="linkCode" />
        </AffectedUserProvider>,
      )
      fireEvent.changeText(getByTestId("code-input"), "$A12345")

      const nextButton = getByLabelText("Next")
      const errorMessageText = "Codes may only contain numbers and letters"

      expect(nextButton).toBeDisabled()
      expect(getByText(errorMessageText)).toBeDefined()

      fireEvent.changeText(getByTestId("code-input"), "A1234578")

      expect(nextButton).toBeEnabled()
      expect(queryByText(errorMessageText)).toBeNull()
    })
  })
})
