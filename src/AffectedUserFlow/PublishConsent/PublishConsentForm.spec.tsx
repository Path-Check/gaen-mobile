import React from "react"
import { cleanup, render, fireEvent, wait } from "@testing-library/react-native"
import "@testing-library/jest-native/extend-expect"
import { useNavigation } from "@react-navigation/native"

import PublishConsentForm from "./PublishConsentForm"
import { Screens } from "../../navigation"
import { ExposureContext } from "../../ExposureContext"
import { factories } from "../../factories"

afterEach(cleanup)

jest.mock("@react-navigation/native")

describe("PublishConsentScreen", () => {
  describe("when the provider has a valid hmac and certificate", () => {
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

        await wait(() => {
          expect(submitDiagnosisKeysSpy).toHaveBeenCalledWith(
            certificate,
            hmacKey,
          )
          expect(navigateSpy).toHaveBeenCalledWith(Screens.AffectedUserComplete)
        })
      })
    })
  })
})
