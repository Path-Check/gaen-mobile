import {
  postDiagnosisKeys,
  PostKeysNoOpReason,
  PostKeysError,
} from "./exposureNotificationAPI"
import { ExposureKey } from "../exposureKey"

describe("postDiagnosisKeys", () => {
  it("executes requests with default headers and serialized data", async () => {
    const exposureKeys: ExposureKey[] = []
    const regionCodes: string[] = []
    const certificate = "certificate"
    const hmacKey = "hmacKey"
    const appPackageName = "appPackageName"
    const revisionToken = "revisionToken"

    const fetchSpy = jest.fn()
    ;(fetch as jest.Mock) = fetchSpy
    fetchSpy.mockRejectedValueOnce("error")

    await postDiagnosisKeys(
      exposureKeys,
      regionCodes,
      certificate,
      hmacKey,
      appPackageName,
      revisionToken,
    )

    // The constants are taken from "__mocks__/react-native-config.js"
    expect(fetchSpy).toHaveBeenCalledWith("POST_DIAGNOSIS_KEYS_URL", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        temporaryExposureKeys: exposureKeys,
        regions: regionCodes,
        appPackageName,
        verificationPayload: certificate,
        hmackey: hmacKey,
        padding: "",
        revisionToken,
      }),
    })
  })

  describe("on a successful request", () => {
    it("returns a success response with the revisionToken", async () => {
      const revisionToken = "revisionToken"

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce({ revisionToken }),
      })

      const result = await postDiagnosisKeys(
        [],
        [],
        "certificate",
        "hmacKey",
        "appPackageName",
        "revisionToken",
      )

      expect(result).toEqual({
        kind: "success",
        revisionToken,
      })
    })
  })

  describe("on a no op response", () => {
    it("returns a NoTokenForExistingKeys response if the error corresponds", async () => {
      const newKeysInserted = 0
      const message = "no revision token, but sent existing keys"
      const jsonResponse = {
        error: message,
        insertedExposures: newKeysInserted,
      }

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: jest.fn().mockResolvedValueOnce(jsonResponse),
      })

      const result = await postDiagnosisKeys(
        [],
        [],
        "certificate",
        "hmacKey",
        "appPackageName",
        "revisionToken",
      )

      expect(result).toEqual({
        kind: "no-op",
        reason: PostKeysNoOpReason.NoTokenForExistingKeys,
        newKeysInserted,
        message,
      })
    })
  })

  describe("on a request that fails", () => {
    describe("when the error is a catched exception", () => {
      it("returns the error message if the request errors", async () => {
        const errorMessage = "errorMessage"
        const fetchSpy = jest.fn()
        ;(fetch as jest.Mock) = fetchSpy
        fetchSpy.mockRejectedValueOnce(new Error(errorMessage))

        const result = await postDiagnosisKeys(
          [],
          [],
          "certificate",
          "hmacKey",
          "appPackageName",
          "revisionToken",
        )

        expect(result).toEqual({
          kind: "failure",
          nature: PostKeysError.RequestFailed,
          message: errorMessage,
        })
      })
    })

    describe("when the error is a failed response from the server", () => {
      it("returns the error on the response ", async () => {
        const error = "error"
        ;(fetch as jest.Mock).mockResolvedValueOnce({
          ok: false,
          json: jest.fn().mockResolvedValueOnce({ error }),
        })

        const result = await postDiagnosisKeys(
          [],
          [],
          "certificate",
          "hmacKey",
          "appPackageName",
          "revisionToken",
        )

        expect(result).toEqual({
          kind: "failure",
          nature: PostKeysError.Unknown,
          message: error,
        })
      })
    })
  })
})
