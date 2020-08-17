import React from "react"
import { render, fireEvent, waitFor } from "@testing-library/react-native"
import "@testing-library/jest-native/extend-expect"
import { useNavigation } from "@react-navigation/native"

import PublishConsentForm from "./PublishConsentForm"
import { Screens } from "../../navigation"
import { ExposureContext } from "../../ExposureContext"
import { factories } from "../../factories"
import { Alert } from "react-native"

jest.mock("@react-navigation/native")

describe("PublishConsentScreen", () => {
  it("navigates to the home screen when user cancels", () => {
    const navigateSpy = jest.fn()
    ;(useNavigation as jest.Mock).mockReturnValue({ navigate: navigateSpy })
    const { getByLabelText } = render(
      <ExposureContext.Provider value={factories.exposureContext.build()}>
        <PublishConsentForm hmacKey="hmacKey" certificate="certificate" />
      </ExposureContext.Provider>,
    )

    fireEvent.press(getByLabelText("Cancel"))

    expect(navigateSpy).toHaveBeenCalledWith("Home")
  })

  it("displays the consent title and body", () => {
    const { getByText } = render(
      <ExposureContext.Provider value={factories.exposureContext.build()}>
        <PublishConsentForm hmacKey="hmacKey" certificate="certificate" />
      </ExposureContext.Provider>,
    )

    expect(getByText("Notify your community")).toBeDefined()
    expect(
      getByText(
        /Sharing your positive diagnosis is optional and can only be done with your consent./,
      ),
    ).toBeDefined()
    expect(
      getByText(
        /If you choose to do so, you're helping others in your community make informed decisions about their health and playing your part to contain the spread of the virus./,
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
      const submitDiagnosisKeysSpy = jest.fn().mockResolvedValue("")
      const exposureContext = factories.exposureContext.build({
        submitDiagnosisKeys: submitDiagnosisKeysSpy,
      })

      const { getByLabelText } = render(
        <ExposureContext.Provider value={exposureContext}>
          <PublishConsentForm hmacKey={hmacKey} certificate={certificate} />
        </ExposureContext.Provider>,
      )

      fireEvent.press(getByLabelText("I understand and consent"))

      await waitFor(() => {
        expect(submitDiagnosisKeysSpy).toHaveBeenCalledWith(
          certificate,
          hmacKey,
        )
        expect(navigateSpy).toHaveBeenCalledWith(Screens.AffectedUserComplete)
      })
    })
  })

  describe("on a failed key submission", () => {
    it("displays an alert with a generic message", async () => {
      const hmacKey = "hmacKey"
      const certificate = "certificate"
      const submitDiagnosisKeysSpy = jest.fn().mockRejectedValueOnce("reject")
      const exposureContext = factories.exposureContext.build({
        submitDiagnosisKeys: submitDiagnosisKeysSpy,
      })
      const alertSpy = jest.spyOn(Alert, "alert")

      const { getByLabelText } = render(
        <ExposureContext.Provider value={exposureContext}>
          <PublishConsentForm hmacKey={hmacKey} certificate={certificate} />
        </ExposureContext.Provider>,
      )

      fireEvent.press(getByLabelText("I understand and consent"))

      await waitFor(() => {
        expect(submitDiagnosisKeysSpy).toHaveBeenCalledWith(
          certificate,
          hmacKey,
        )
        expect(alertSpy).toHaveBeenCalledWith("Something went wrong", undefined)
      })
    })
  })
})
