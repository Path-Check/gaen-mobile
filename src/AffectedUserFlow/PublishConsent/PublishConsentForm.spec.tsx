import React from "react"
import { render, fireEvent, waitFor } from "@testing-library/react-native"
import "@testing-library/jest-native/extend-expect"
import { useNavigation } from "@react-navigation/native"
import { Alert } from "react-native"

import PublishConsentForm from "./PublishConsentForm"
import { Screens } from "../../navigation"
import { ExposureContext } from "../../ExposureContext"
import { factories } from "../../factories"
import * as ExposureAPI from "../exposureNotificationAPI"

jest.mock("@react-navigation/native")
jest.mock("../../logger.ts")

describe("PublishConsentScreen", () => {
  it("navigates to the home screen when user cancels", () => {
    const navigateSpy = jest.fn()
    ;(useNavigation as jest.Mock).mockReturnValue({ navigate: navigateSpy })
    const { getByLabelText } = render(
      <ExposureContext.Provider value={factories.exposureContext.build()}>
        <PublishConsentForm
          hmacKey="hmacKey"
          certificate="certificate"
          exposureKeys={[]}
          storeRevisionToken={jest.fn()}
          revisionToken=""
          appPackageName=""
          regionCodes={[""]}
        />
      </ExposureContext.Provider>,
    )

    fireEvent.press(getByLabelText("Cancel"))

    expect(navigateSpy).toHaveBeenCalledWith("Home")
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
        /If you choose to do so, you’re helping others in your community make informed decisions about their health and playing your part to contain the spread of the virus./,
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
        body: { revisionToken: newRevisionToken },
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
        )
        expect(storeRevisionTokenSpy).toHaveBeenCalledWith(newRevisionToken)
        expect(navigateSpy).toHaveBeenCalledWith(Screens.AffectedUserComplete)
      })
    })
  })

  describe("on a failed key submission", () => {
    describe("when there is a server error", () => {
      it("displays an alert with the error message from the server", async () => {
        const errorMessage = "error"
        const postDiagnosisKeysSpy = jest.spyOn(
          ExposureAPI,
          "postDiagnosisKeys",
        )
        postDiagnosisKeysSpy.mockResolvedValueOnce({
          kind: "failure" as const,
          error: "Unknown",
          message: errorMessage,
        })
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
          />,
        )

        fireEvent.press(getByLabelText("I Understand and Consent"))

        await waitFor(() => {
          expect(alertSpy).toHaveBeenCalledWith(
            "Something went wrong",
            errorMessage,
          )
        })
      })
    })

    describe("when there is an unhandled exception", () => {
      it("displays an alert with a generic message", async () => {
        const errorMessage = "error"
        const postDiagnosisKeysSpy = jest.spyOn(
          ExposureAPI,
          "postDiagnosisKeys",
        )
        postDiagnosisKeysSpy.mockRejectedValueOnce(new Error(errorMessage))
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
          />,
        )

        fireEvent.press(getByLabelText("I Understand and Consent"))

        await waitFor(() => {
          expect(alertSpy).toHaveBeenCalledWith(
            "Something went wrong",
            errorMessage,
          )
        })
      })
    })
  })
})
