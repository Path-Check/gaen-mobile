import React from "react"
import { render, fireEvent, waitFor } from "@testing-library/react-native"
import "@testing-library/jest-native/extend-expect"
import { useNavigation } from "@react-navigation/native"
import { Alert } from "react-native"

import PublishConsentForm from "./PublishConsentForm"
import { AffectedUserFlowStackScreens } from "../../navigation"
import { ExposureContext } from "../../ExposureContext"
import { factories } from "../../factories"
import * as ExposureAPI from "../exposureNotificationAPI"
import Logger from "../../logger"

jest.mock("@react-navigation/native")
jest.mock("../../logger.ts")

describe("PublishConsentForm", () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it("displays the consent title and body", () => {
    const { getByText } = render(
      <ExposureContext.Provider value={factories.exposureContext.build()}>
        <PublishConsentForm
          hmacKey="hmacKey"
          certificate="certificate"
          exposureKeys={[]}
          storeRevisionToken={jest.fn()}
          revisionToken=""
          appPackageName=""
          regionCodes={[""]}
          navigateOutOfStack={() => {}}
          symptomOnsetDate={null}
        />
      </ExposureContext.Provider>,
    )

    expect(getByText("Notify others in your community")).toBeDefined()
    expect(
      getByText(
        /Sharing your positive diagnosis is optional and can only be done with your consent./,
      ),
    ).toBeDefined()
    expect(
      getByText(
        /The only information shared will be the random set of numbers your phone exchanged over Bluetooth with other phones that were nearby during the past 14 days, along with a weighted risk score based on when your symptoms developed./,
      ),
    ).toBeDefined()
  })

  describe("on a successful key submission", () => {
    it("navigates to the affected user complete screen", async () => {
      const navigateSpy = jest.fn()
      ;(useNavigation as jest.Mock).mockReturnValue({ navigate: navigateSpy })

      const hmacKey = "hmacKey"
      const certificate = "certificate"
      const exposureKeys = [
        {
          key: "key",
          rollingPeriod: 1,
          rollingStartNumber: 1,
          transmissionRisk: 0,
        },
      ]
      const revisionToken = "revisionToken"
      const appPackageName = "appPackageName"
      const regionCodes = ["region"]
      const storeRevisionTokenSpy = jest.fn()
      const newRevisionToken = "newRevisionToken"
      const successfulPostResponse = {
        kind: "success" as const,
        revisionToken: newRevisionToken,
      }
      const postDiagnosisKeysSpy = jest.spyOn(ExposureAPI, "postDiagnosisKeys")
      postDiagnosisKeysSpy.mockResolvedValue(successfulPostResponse)

      const { getByLabelText } = render(
        <PublishConsentForm
          hmacKey={hmacKey}
          certificate={certificate}
          exposureKeys={exposureKeys}
          storeRevisionToken={storeRevisionTokenSpy}
          revisionToken={revisionToken}
          appPackageName={appPackageName}
          regionCodes={regionCodes}
          navigateOutOfStack={() => {}}
          symptomOnsetDate={null}
        />,
      )

      fireEvent.press(getByLabelText("I Understand and Consent"))

      await waitFor(() => {
        expect(postDiagnosisKeysSpy).toHaveBeenCalledWith(
          exposureKeys,
          regionCodes,
          certificate,
          hmacKey,
          appPackageName,
          revisionToken,
          null,
        )
        expect(storeRevisionTokenSpy).toHaveBeenCalledWith(newRevisionToken)
        expect(navigateSpy).toHaveBeenCalledWith(
          AffectedUserFlowStackScreens.AffectedUserComplete,
        )
      })
    })
  })

  describe("on a no-op key submission", () => {
    describe("when the error is related to the revision token", () => {
      it("displays a message explaining the cause to the user", async () => {
        const navigateSpy = jest.fn()
        ;(useNavigation as jest.Mock).mockReturnValue({ navigate: navigateSpy })
        const newKeysInserted = 1
        const noOpPostResponse = {
          kind: "no-op" as const,
          reason: ExposureAPI.PostKeysNoOpReason.NoTokenForExistingKeys,
          newKeysInserted,
          message: "no_token_for_existing_keys",
        }
        const postDiagnosisKeysSpy = jest.spyOn(
          ExposureAPI,
          "postDiagnosisKeys",
        )
        postDiagnosisKeysSpy.mockResolvedValueOnce(noOpPostResponse)
        const alertSpy = jest.spyOn(Alert, "alert")

        const { getByLabelText } = render(
          <PublishConsentForm
            hmacKey="hmacKey"
            certificate="certificate"
            exposureKeys={[]}
            storeRevisionToken={jest.fn()}
            revisionToken=""
            appPackageName=""
            regionCodes={[""]}
            navigateOutOfStack={() => {}}
            symptomOnsetDate={null}
          />,
        )

        fireEvent.press(getByLabelText("I Understand and Consent"))

        await waitFor(() => {
          expect(
            alertSpy,
          ).toHaveBeenCalledWith(
            "Attempt to submit existing keys",
            `Existing data was sent to the server. This usually means that this process was attempted previously from this device, but on a different application. You can communicate this to the authority that provided the verification code that was used. There were ${newKeysInserted} new keys added.`,
            [{ onPress: expect.any(Function) }],
          )
        })
      })
    })

    describe("when the error is related to an empty exposure history", () => {
      it("displays a message explaining the cause to the user", async () => {
        const navigateSpy = jest.fn()
        ;(useNavigation as jest.Mock).mockReturnValue({ navigate: navigateSpy })
        const noOpPostResponse = {
          kind: "no-op" as const,
          reason: ExposureAPI.PostKeysNoOpReason.EmptyExposureKeys,
          newKeysInserted: 0,
          message: "message",
        }
        const postDiagnosisKeysSpy = jest.spyOn(
          ExposureAPI,
          "postDiagnosisKeys",
        )
        postDiagnosisKeysSpy.mockResolvedValueOnce(noOpPostResponse)
        const alertSpy = jest.spyOn(Alert, "alert")

        const { getByLabelText } = render(
          <PublishConsentForm
            hmacKey="hmacKey"
            certificate="certificate"
            exposureKeys={[]}
            storeRevisionToken={jest.fn()}
            revisionToken=""
            appPackageName=""
            regionCodes={[""]}
            navigateOutOfStack={() => {}}
            symptomOnsetDate={null}
          />,
        )

        fireEvent.press(getByLabelText("I Understand and Consent"))

        await waitFor(() => {
          expect(
            alertSpy,
          ).toHaveBeenCalledWith(
            "No encounter logging data is available",
            "It looks like you have no encounter logs on your device, please wait 24 hours to proceed if you recently reset your data. You may need to request a new verification code.",
            [{ onPress: expect.any(Function) }],
          )
        })
      })
    })
  })

  describe("on a failed key submission", () => {
    describe("when the error is unknown", () => {
      it("displays an alert with the error message", async () => {
        const errorMessage = "error"
        const postDiagnosisKeysSpy = jest.spyOn(
          ExposureAPI,
          "postDiagnosisKeys",
        )
        postDiagnosisKeysSpy.mockResolvedValueOnce({
          kind: "failure",
          nature: ExposureAPI.PostKeysError.Unknown,
          message: errorMessage,
        })
        const alertSpy = jest.spyOn(Alert, "alert")
        const loggerSpy = jest.spyOn(Logger, "error")

        const { getByLabelText } = render(
          <PublishConsentForm
            hmacKey="hmacKey"
            certificate="certificate"
            exposureKeys={[]}
            storeRevisionToken={jest.fn()}
            revisionToken=""
            appPackageName=""
            regionCodes={[""]}
            navigateOutOfStack={() => {}}
            symptomOnsetDate={null}
          />,
        )

        fireEvent.press(getByLabelText("I Understand and Consent"))

        await waitFor(() => {
          expect(alertSpy).toHaveBeenCalledWith(
            "Failed to submit the exposure data",
            `The operation could not be completed. ${errorMessage}`,
          )
          expect(loggerSpy).toHaveBeenCalledWith(
            `IncompleteKeySumbission.Unknown.${errorMessage}`,
          )
        })
      })
    })

    describe("when the response is an internal server error", () => {
      it("displays an alert with the server error message", async () => {
        const errorMessage = "internal_error"
        const postDiagnosisKeysSpy = jest.spyOn(
          ExposureAPI,
          "postDiagnosisKeys",
        )
        postDiagnosisKeysSpy.mockResolvedValueOnce({
          kind: "failure",
          nature: ExposureAPI.PostKeysError.InternalServerError,
          message: errorMessage,
        })
        const alertSpy = jest.spyOn(Alert, "alert")
        const loggerSpy = jest.spyOn(Logger, "error")

        const { getByLabelText } = render(
          <PublishConsentForm
            hmacKey="hmacKey"
            certificate="certificate"
            exposureKeys={[]}
            storeRevisionToken={jest.fn()}
            revisionToken=""
            appPackageName=""
            regionCodes={[""]}
            navigateOutOfStack={() => {}}
            symptomOnsetDate={null}
          />,
        )

        fireEvent.press(getByLabelText("I Understand and Consent"))

        await waitFor(() => {
          expect(alertSpy).toHaveBeenCalledWith(
            "The server is experiencing problems, please try again later",
            `The operation could not be completed. ${errorMessage}`,
          )
          expect(loggerSpy).toHaveBeenCalledWith(
            `IncompleteKeySumbission.InternalServerError.${errorMessage}`,
          )
        })
      })
    })

    describe("when the request times out", () => {
      it("displays an alert with the timeout error", async () => {
        const errorMessage = "timeout"
        const postDiagnosisKeysSpy = jest.spyOn(
          ExposureAPI,
          "postDiagnosisKeys",
        )
        postDiagnosisKeysSpy.mockResolvedValueOnce({
          kind: "failure",
          nature: ExposureAPI.PostKeysError.Timeout,
          message: errorMessage,
        })
        const alertSpy = jest.spyOn(Alert, "alert")
        const loggerSpy = jest.spyOn(Logger, "error")

        const { getByLabelText } = render(
          <PublishConsentForm
            hmacKey="hmacKey"
            certificate="certificate"
            exposureKeys={[]}
            storeRevisionToken={jest.fn()}
            revisionToken=""
            appPackageName=""
            regionCodes={[""]}
            navigateOutOfStack={() => {}}
            symptomOnsetDate={null}
          />,
        )

        fireEvent.press(getByLabelText("I Understand and Consent"))

        await waitFor(() => {
          expect(alertSpy).toHaveBeenCalledWith(
            "The request took too long to complete",
            `The operation could not be completed. ${errorMessage}`,
          )
          expect(loggerSpy).toHaveBeenCalledWith(
            `IncompleteKeySumbission.Timeout.${errorMessage}`,
          )
        })
      })
    })

    describe("when the request processing fails", () => {
      it("displays an alert with the error message", async () => {
        const errorMessage = "error"
        const postDiagnosisKeysSpy = jest.spyOn(
          ExposureAPI,
          "postDiagnosisKeys",
        )
        postDiagnosisKeysSpy.mockResolvedValueOnce({
          kind: "failure",
          nature: ExposureAPI.PostKeysError.RequestFailed,
          message: errorMessage,
        })

        const alertSpy = jest.spyOn(Alert, "alert")
        const loggerSpy = jest.spyOn(Logger, "error")

        const { getByLabelText } = render(
          <PublishConsentForm
            hmacKey="hmacKey"
            certificate="certificate"
            exposureKeys={[]}
            storeRevisionToken={jest.fn()}
            revisionToken=""
            appPackageName=""
            regionCodes={[""]}
            navigateOutOfStack={() => {}}
            symptomOnsetDate={null}
          />,
        )

        fireEvent.press(getByLabelText("I Understand and Consent"))

        await waitFor(() => {
          expect(alertSpy).toHaveBeenCalledWith(
            "Something went wrong",
            `The operation could not be completed. ${errorMessage}`,
          )
          expect(loggerSpy).toHaveBeenCalledWith(
            `IncompleteKeySumbission.RequestFailed.${errorMessage}`,
          )
        })
      })
    })
  })
})
