import React from "react"
import { cleanup, render, fireEvent, wait } from "@testing-library/react-native"
import "@testing-library/jest-native/extend-expect"
import { useNavigation } from "@react-navigation/native"

import PublishConsentForm from "./PublishConsentForm"
import { Screens } from "../../navigation"
import { ExposureProvider } from "../../ExposureContext"

afterEach(cleanup)

let mockSubmitDiagnosis: jest.Mock | undefined
jest.mock("@react-navigation/native")
jest.mock("../../gaen", () => {
  mockSubmitDiagnosis = jest.fn().mockResolvedValue("")
  return {
    exposureEventsStrategy: {
      getExposureKeys: () => Promise.resolve([]),
      submitDiagnosisKeys: mockSubmitDiagnosis,
      exposureInfoSubscription: () => ({ remove: () => {} }),
      getLastDetectionDate: () => Promise.resolve({}),
      getCurrentExposures: () => {},
    },
  }
})

describe("PublishConsentScreen", () => {
  describe("when the provider has a valid hmac and certificate", () => {
    describe("on a successful key submission", () => {
      it("navigates to the affected user complete screen", async () => {
        const navigateSpy = jest.fn()
        ;(useNavigation as jest.Mock).mockReturnValue({ navigate: navigateSpy })

        const hmacKey = "hmacKey"
        const certificate = "certificate"

        const { getByLabelText } = render(
          <ExposureProvider>
            <PublishConsentForm hmacKey={hmacKey} certificate={certificate} />
          </ExposureProvider>,
        )

        fireEvent.press(getByLabelText("I understand and consent"))

        await wait(() => {
          expect(mockSubmitDiagnosis).toHaveBeenCalledWith(certificate, hmacKey)
          expect(navigateSpy).toHaveBeenCalledWith(Screens.AffectedUserComplete)
        })
      })
    })
  })
})
